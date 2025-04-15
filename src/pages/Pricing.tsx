import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Check, X, HelpCircle, ChevronRight } from 'lucide-react';
import { createCheckoutSession } from '../services/stripe';

interface Feature {
  name: string;
  description?: string;
  basic: boolean | string;
  plus: boolean | string;
  pro: boolean | string;
}

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscriptionPlans, currentPlan } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showComparison, setShowComparison] = useState(false);

  // Features comparison data
  const features: Feature[] = [
    { 
      name: 'Stock Data Access', 
      description: 'Access to historical and current stock data',
      basic: true, 
      plus: true, 
      pro: true 
    },
    { 
      name: 'Technical Indicators', 
      description: 'Access to technical analysis tools',
      basic: '5 indicators', 
      plus: '15 indicators', 
      pro: 'All indicators' 
    },
    { 
      name: 'Real-time Data', 
      description: 'How frequently stock data is updated',
      basic: 'End of day', 
      plus: 'Hourly', 
      pro: 'Real-time' 
    },
    { 
      name: 'AI Predictions', 
      description: 'Stock price movement predictions',
      basic: 'Basic', 
      plus: 'Advanced', 
      pro: 'Premium' 
    },
    { 
      name: 'News Analysis', 
      description: 'Financial news sentiment analysis',
      basic: false, 
      plus: true, 
      pro: true 
    },
    { 
      name: 'Portfolio Tracking', 
      description: 'Track your investments in one place',
      basic: 'Limited (5 stocks)', 
      plus: 'Standard (20 stocks)', 
      pro: 'Unlimited' 
    },
    { 
      name: 'Custom Alerts', 
      description: 'Get notified of important market events',
      basic: '3 alerts', 
      plus: '10 alerts', 
      pro: 'Unlimited' 
    },
    { 
      name: 'Data Export', 
      description: 'Export analysis and data',
      basic: false, 
      plus: true, 
      pro: true 
    },
    { 
      name: 'API Access', 
      description: 'Programmatic access to our platform',
      basic: false, 
      plus: false, 
      pro: true 
    },
    { 
      name: 'Stock Screening', 
      description: 'Advanced stock screener tool',
      basic: 'Basic filters', 
      plus: 'Advanced filters', 
      pro: 'Custom screeners' 
    },
    { 
      name: 'Technical Support', 
      description: 'Access to customer support',
      basic: 'Email only', 
      plus: 'Email & Chat', 
      pro: 'Priority Support' 
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate('/login', { state: { returnTo: '/pricing', intendedPlan: planId } });
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
        planPrice: selectedPlan.price,
        isAnnual: billingPeriod === 'annual'
      });
      
      // Note: The redirect to Stripe Checkout happens in the createCheckoutSession function
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      setLoading(null);
    }
  };

  const getDiscountedPrice = (price: number) => {
    return billingPeriod === 'annual' ? (price * 10 * 0.8).toFixed(2) : price;
  };

  const getFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-red-500" />
      );
    }
    return <span>{value}</span>;
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Get access to AI-powered stock predictions and market insights with our flexible subscription options
          </p>

          {/* Billing period toggle */}
          <div className="mt-8 flex justify-center">
            <div className="relative bg-gray-200 rounded-full p-1 flex w-64">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`${
                  billingPeriod === 'monthly' ? 'bg-white shadow-sm' : ''
                } relative rounded-full py-2 px-4 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-1/2`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`${
                  billingPeriod === 'annual' ? 'bg-white shadow-sm' : ''
                } relative rounded-full py-2 px-4 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-1/2`}
              >
                Annual <span className="text-green-600 font-bold">20% off</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-md mx-auto mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Plan cards */}
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 bg-white transform transition duration-300 ${
                currentPlan === plan.id ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
              }`}
            >
              {currentPlan === plan.id && (
                <div className="bg-blue-500 text-white text-center py-1 px-2 rounded-t-lg">
                  Current Plan
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
                <p className="mt-4 text-sm text-gray-500">
                  {plan.id === 'basic' ? 'Essential features for new investors' : 
                   plan.id === 'plus' ? 'Advanced analytics for active traders' : 
                   'Complete solution for serious investors'}
                </p>
                <p className="mt-8 flex items-baseline justify-center">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${getDiscountedPrice(plan.price)}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </p>
                {billingPeriod === 'annual' && (
                  <p className="mt-1 text-sm text-green-600 text-center">
                    Save ${(plan.price * 12 * 0.2).toFixed(2)} annually
                  </p>
                )}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || currentPlan === plan.id}
                  className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium transition-colors ${
                    currentPlan === plan.id
                      ? 'bg-blue-50 text-blue-700 cursor-default'
                      : loading === plan.id
                      ? 'bg-blue-400 text-white cursor-wait'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  aria-disabled={loading === plan.id || currentPlan === plan.id}
                >
                  {currentPlan === plan.id 
                    ? 'Current Plan' 
                    : loading === plan.id 
                    ? 'Processing...' 
                    : 'Subscribe'}
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
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

        {/* Compare all features button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showComparison ? 'Hide comparison' : 'Compare all features'}
            <ChevronRight className={`ml-2 h-4 w-4 transform transition-transform ${showComparison ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Feature comparison table */}
        {showComparison && (
          <div className="mt-12 overflow-hidden shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plus
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {features.map((feature, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 relative group">
                      {feature.name}
                      {feature.description && (
                        <div className="inline-block ml-2 relative">
                          <HelpCircle className="h-4 w-4 text-gray-400 inline cursor-help" />
                          <div className="absolute left-0 bottom-6 z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            {feature.description}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">
                      {getFeatureValue(feature.basic)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">
                      {getFeatureValue(feature.plus)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center">
                      {getFeatureValue(feature.pro)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FAQ section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left font-medium flex justify-between items-center focus:outline-none"
                onClick={() => document.getElementById('faq-1')?.classList.toggle('hidden')}
              >
                <span>Can I upgrade or downgrade my plan later?</span>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </button>
              <div id="faq-1" className="hidden px-6 pb-4">
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your subscription at any time. Changes will be applied at the start of your next billing cycle.
                </p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left font-medium flex justify-between items-center focus:outline-none"
                onClick={() => document.getElementById('faq-2')?.classList.toggle('hidden')}
              >
                <span>Is there a free trial available?</span>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </button>
              <div id="faq-2" className="hidden px-6 pb-4">
                <p className="text-gray-600">
                  We offer a limited demo version that you can try before subscribing. You can access it from our demo page without payment information.
                </p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left font-medium flex justify-between items-center focus:outline-none"
                onClick={() => document.getElementById('faq-3')?.classList.toggle('hidden')}
              >
                <span>What payment methods do you accept?</span>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </button>
              <div id="faq-3" className="hidden px-6 pb-4">
                <p className="text-gray-600">
                  We accept all major credit cards and debit cards through our secure payment processor, Stripe. We also support PayPal for select regions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-blue-700 rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:py-16">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Ready to start making smarter investment decisions?
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-blue-100">
                Join thousands of investors already using FinPulses to analyze the market and make better trading decisions.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="sm:flex">
                <a
                  href="/demo-stock"
                  className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                >
                  Try Demo
                </a>
                <a
                  href="/register"
                  className="mt-3 sm:mt-0 sm:ml-3 flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  Sign Up Now
                </a>
              </div>
              <p className="mt-3 text-sm text-blue-200">
                No credit card required for demo. Cancel your subscription anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 