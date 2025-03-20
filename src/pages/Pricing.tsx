import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Check } from 'lucide-react';
import { createCheckoutSession } from '../services/stripe';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscriptionPlans, currentPlan } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If user already has this plan, no need to proceed
    if (currentPlan === planId) {
      return;
    }

    setLoading(planId);
    setError(null);

    try {
      // Find the selected plan details
      const selectedPlan = subscriptionPlans.find(plan => plan.id === planId);
      
      if (!selectedPlan) {
        throw new Error('Selected plan not found');
      }
      
      // Create a checkout session with Stripe
      await createCheckoutSession({
        userId: user.uid,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        planPrice: selectedPlan.price
      });
      
      // Note: The redirect to Stripe Checkout happens in the createCheckoutSession function
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      setLoading(null);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose your plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Get access to AI-powered stock predictions and market insights
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 bg-white ${
                currentPlan === plan.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-sm text-gray-500">
                  {plan.id === 'basic' ? 'Basic analytics and predictions' : 
                   plan.id === 'intermediate' ? 'Advanced analytics and real-time data' : 
                   'Full access to all premium features'}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || currentPlan === plan.id}
                  className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                    currentPlan === plan.id
                      ? 'bg-blue-50 text-blue-700 cursor-default'
                      : loading === plan.id
                      ? 'bg-blue-400 text-white cursor-wait'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {currentPlan === plan.id 
                    ? 'Current Plan' 
                    : loading === plan.id 
                    ? 'Processing...' 
                    : 'Subscribe'}
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing; 