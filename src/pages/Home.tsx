import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Shield, Zap } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { supabase } from '../services/supabaseClient';

// Fallback plans in case the subscription context isn't available
const fallbackPlans = [
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

const Home: React.FC = () => {
  // Try to get subscription plans from context, fall back to local data if error
  let subscriptionPlans = fallbackPlans;
  try {
    const { subscriptionPlans: contextPlans } = useSubscription();
    if (contextPlans && contextPlans.length > 0) {
      subscriptionPlans = contextPlans;
    }
  } catch (error) {
    console.warn('Subscription context not available, using fallback plans');
  }

  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [preferredPlan, setPreferredPlan] = useState('1'); // Default to Free Plan
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            email,
            name,
            preferred_plan: preferredPlan,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setEmail('');
      setName('');
      setPreferredPlan('1');
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      setSubmitError('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1640340434771-5e72dc61728a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80" 
            alt="Stock market chart"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-transparent"></div>
        </div>
        <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            AI-Powered Stock Predictions
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Finpulses.tech uses advanced machine learning algorithms to analyze market trends and provide accurate stock predictions to help you make better investment decisions.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {submitSuccess ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md">
                <p className="font-medium">You've joined our waitlist!</p>
                <p>We'll notify you when you get access.</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowWaitlistForm(true)}
                  className="px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Join Waitlist
                </button>
                <Link
                  to="/demo-stock"
                  className="px-8 py-3 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Try Demo
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Why Choose Finpulses?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Get ahead in the market with our cutting-edge features
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="text-blue-400 mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-medium text-white">AI Predictions</h3>
              <p className="mt-2 text-gray-300">Advanced algorithms predict market trends with high accuracy</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="text-blue-400 mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-medium text-white">Expert Analysis</h3>
              <p className="mt-2 text-gray-300">Get insights from market experts and seasoned analysts</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="text-blue-400 mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-medium text-white">Risk Management</h3>
              <p className="mt-2 text-gray-300">Advanced tools to help you manage and minimize risks</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="text-blue-400 mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-medium text-white">Real-time Updates</h3>
              <p className="mt-2 text-gray-300">Get instant notifications about market changes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Subscription Plans
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
              Choose the right plan for your investment needs
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className="border border-gray-700 rounded-lg shadow-sm divide-y divide-gray-700 overflow-hidden"
              >
                <div className="p-6 bg-gray-800">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-white">${plan.price}</span>
                    <span className="text-base font-medium text-gray-300">/month</span>
                  </p>
                  <div className="mt-8 flex flex-col gap-4">
                    <button
                      onClick={() => {
                        setPreferredPlan(plan.id.toString());
                        setShowWaitlistForm(true);
                      }}
                      className="bg-blue-600 text-white rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Join Waitlist
                    </button>
                    <Link
                      to="/demo-stock"
                      className="bg-blue-600 text-white rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                    >
                      Try Demo
                    </Link>
                  </div>
                </div>
                <div className="px-6 pt-6 pb-8 bg-gray-800">
                  <h4 className="text-sm font-semibold text-gray-300 tracking-wide uppercase">What's included</h4>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex space-x-3">
                        <Zap className="flex-shrink-0 h-5 w-5 text-blue-400" />
                        <span className="text-base text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            <span className="block">Ready to boost your investments?</span>
            <span className="block">Start using Finpulses today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={() => setShowWaitlistForm(true)}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Form Modal */}
      {showWaitlistForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Join the Waitlist</h2>
            <form onSubmit={handleWaitlistSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="plan" className="block text-sm font-medium text-gray-300">
                    Preferred Plan
                  </label>
                  <select
                    id="plan"
                    value={preferredPlan}
                    onChange={(e) => setPreferredPlan(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {subscriptionPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} (${plan.price}/month)
                      </option>
                    ))}
                  </select>
                </div>
                {submitError && (
                  <div className="text-red-400 text-sm">{submitError}</div>
                )}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowWaitlistForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 