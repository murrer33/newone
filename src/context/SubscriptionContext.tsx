import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

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
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 9.99,
    features: ['Basic stock analysis', 'Daily market updates', 'Limited API calls']
  },
  {
    id: 'intermediate',
    name: 'Intermediate Plan',
    price: 19.99,
    features: ['Advanced stock analysis', 'Real-time market data', 'Technical indicators', 'Portfolio tracking']
  },
  {
    id: 'advanced',
    name: 'Advanced Plan',
    price: 29.99,
    features: ['Premium stock analysis', 'AI predictions', 'Unlimited API calls', 'Priority support', 'Custom alerts']
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setCurrentPlan(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'subscriptions', user.uid),
      (doc) => {
        if (doc.exists()) {
          setCurrentPlan(doc.data().planId);
        } else {
          setCurrentPlan(null);
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
      // Here you would typically integrate with Stripe
      // For now, we'll just update the subscription in Firestore
      await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          planId
        })
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription');
      throw err;
    }
  };

  const value = {
    currentPlan,
    isLoading,
    error,
    subscriptionPlans,
    updateSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext; 