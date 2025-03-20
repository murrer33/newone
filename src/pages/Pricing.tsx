import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscriptionPlans, currentPlan, updateSubscription, isLoading } = useSubscription();

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await updateSubscription(planId);
      navigate('/');
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                currentPlan === plan.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="p-6 bg-white rounded-t-lg">
                <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                    currentPlan === plan.id
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {currentPlan === plan.id ? 'Current Plan' : 'Subscribe'}
                </button>
              </div>
              <div className="px-6 pt-6 pb-8 bg-white rounded-b-lg">
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