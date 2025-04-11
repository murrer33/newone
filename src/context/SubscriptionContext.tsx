import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabaseClient';

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

    // Set up subscription to listen for changes
    const fetchSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to handle no rows case

        if (error) {
          if (error.code === 'PGRST116') {
            // No subscription found, which is fine for new users
            setCurrentPlan(null);
            setSubscriptionDetails(null);
          } else {
            console.error('Error fetching subscription:', error);
            setError('Failed to fetch subscription status');
          }
        } else if (data) {
          setCurrentPlan(data.plan_id);
          setSubscriptionDetails(data);
        } else {
          setCurrentPlan(null);
          setSubscriptionDetails(null);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Exception fetching subscription:', err);
        setError('Failed to fetch subscription status');
        setIsLoading(false);
      }
    };

    fetchSubscription();

    // Set up real-time subscription updates
    const subscription = supabase
      .channel('subscriptions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Subscription changed:', payload);
          if (payload.eventType === 'DELETE') {
            setCurrentPlan(null);
            setSubscriptionDetails(null);
          } else {
            const data = payload.new;
            setCurrentPlan(data.plan_id);
            setSubscriptionDetails(data);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const updateSubscription = async (planId: string) => {
    if (!user) {
      throw new Error('User must be logged in to update subscription');
    }

    try {
      setError(null);
      
      // Check if user already has a subscription
      const { data: existingSub, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = Not found
        console.error('Error checking existing subscription:', fetchError);
        throw new Error('Failed to check existing subscription');
      }
      
      const currentDate = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now
      
      if (existingSub) {
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            plan_id: planId,
            status: 'active',
            current_period_start: currentDate.toISOString(),
            current_period_end: expiryDate.toISOString(),
            updated_at: currentDate.toISOString()
          })
          .eq('id', existingSub.id);
          
        if (updateError) {
          console.error('Error updating subscription:', updateError);
          throw new Error('Failed to update subscription');
        }
      } else {
        // Create new subscription
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert([{
            user_id: user.id,
            plan_id: planId,
            status: 'active',
            current_period_start: currentDate.toISOString(),
            current_period_end: expiryDate.toISOString(),
            created_at: currentDate.toISOString(),
            updated_at: currentDate.toISOString()
          }]);
          
        if (insertError) {
          console.error('Error creating subscription:', insertError);
          throw new Error('Failed to create subscription');
        }
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription');
      throw err;
    }
  };

  // Check if user has access to a specific feature
  const checkFeatureAccess = (featureName: string) => {
    if (!currentPlan) return false;
    
    // Find the current plan in our list
    const plan = subscriptionPlans.find(p => p.id === currentPlan);
    if (!plan) return false;
    
    // Check if the requested feature is available in the user's plan
    return plan.features.some(feature => 
      feature.toLowerCase().includes(featureName.toLowerCase())
    );
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