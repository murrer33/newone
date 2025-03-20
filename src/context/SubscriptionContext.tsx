import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { getSubscriptionStatus, getSubscriptionPlanFeatures } from '../services/stripe';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface SubscriptionContextType {
  currentPlan: string | null;
  isLoading: boolean;
  error: string | null;
  subscriptionPlans: SubscriptionPlan[];
  updateSubscription: (planId: string) => Promise<void>;
  subscriptionDetails: any;
  checkFeatureAccess: (featureName: string) => boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 9.99,
    features: ['Basic stock analysis', 'Daily market updates', 'Limited API calls', 'Email support']
  },
  {
    id: 'intermediate',
    name: 'Intermediate Plan',
    price: 19.99,
    features: ['Advanced stock analysis', 'Real-time market data', 'Technical indicators', 'Portfolio tracking', 'Priority email support']
  },
  {
    id: 'advanced',
    name: 'Advanced Plan',
    price: 29.99,
    features: ['Premium stock analysis', 'AI predictions', 'Unlimited API calls', 'Priority support', 'Custom alerts', 'Sentiment analysis', 'Market insights']
  }
];

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setCurrentPlan(null);
      setSubscriptionDetails(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'subscriptions', user.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setCurrentPlan(data.planId);
          setSubscriptionDetails(data);
        } else {
          setCurrentPlan(null);
          setSubscriptionDetails(null);
        }
        setIsLoading(false);
      },
      (err) => {
        setError('Failed to fetch subscription status');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const updateSubscription = async (planId: string) => {
    if (!user) {
      throw new Error('User must be logged in to update subscription');
    }

    try {
      setError(null);
      
      // Update subscription in Firestore
      // This would typically be done by a server-side webhook from Stripe
      // For testing purposes, we'll update it directly here
      await setDoc(doc(db, 'subscriptions', user.uid), {
        planId,
        userId: user.uid,
        status: 'active',
        createdAt: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription');
      throw err;
    }
  };

  // Check if user has access to a specific feature
  const checkFeatureAccess = (featureName: string) => {
    if (!currentPlan) return false;
    
    // Get features for the current plan
    const planFeatures = getSubscriptionPlanFeatures(currentPlan);
    
    // Check if the requested feature is available in the user's plan
    return Object.entries(planFeatures).some(([key, value]) => {
      if (key === featureName) return !!value;
      if (Array.isArray(value) && value.includes(featureName)) return true;
      return false;
    });
  };

  const value = {
    currentPlan,
    isLoading,
    error,
    subscriptionPlans,
    updateSubscription,
    subscriptionDetails,
    checkFeatureAccess
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext; 