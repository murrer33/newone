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
    
    if (!email) {
      setSubmitError('Email is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Try to add to waitlist table with minimal fields
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([
          { 
            email, 
            name,
            preferred_plan: preferredPlan,
            joined_at: new Date().toISOString(),
            referral_code: Math.random().toString(36).substring(2, 10).toUpperCase()
          }
        ]);
      
      if (insertError) {
        console.error('Error joining waitlist:', insertError);
        setSubmitError('Failed to join waitlist. Please try again later or contact support.');
        
        // Save to local storage as a fallback
        try {
          const waitlistEntries = JSON.parse(localStorage.getItem('waitlistEntries') || '[]');
          waitlistEntries.push({
            email,
            name,
            preferredPlan,
            joinedAt: new Date().toISOString(),
            referralCode: Math.random().toString(36).substring(2, 10).toUpperCase()
          });
          localStorage.setItem('waitlistEntries', JSON.stringify(waitlistEntries));
        } catch (storageError) {
          console.error('Failed to save to local storage:', storageError);
        }
      } else {
        setSubmitSuccess(true);
        setShowWaitlistForm(false);
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setSubmitError('Failed to join waitlist. Please try again later or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1640340434771-5e72dc61728a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80" 
            alt="Stock market chart"
          />
        </div>
        <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            AI-Powered Stock Predictions
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Finpulses.tech uses advanced machine learning algorithms to analyze market trends and provide accurate stock predictions to help you make better investment decisions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
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
                  to="/login"
                  className="px-8 py-3 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Finpulses?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Get ahead of the market with our cutting-edge financial insights platform.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Accurate Predictions
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Our AI models analyze thousands of data points to provide high-accuracy stock movement predictions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <Award className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Premium Insights
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Get access to exclusive technical indicators, sentiment analysis, and market trends.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <Shield className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Secure Platform
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Your data is protected with enterprise-grade security. We never share your information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Subscription Plans
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Choose the right plan for your investment needs
            </p>
          </div>

          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 overflow-hidden"
              >
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </p>
                  <button
                    onClick={() => {
                      setPreferredPlan(plan.id.toString());
                      setShowWaitlistForm(true);
                    }}
                    className="mt-8 block w-full bg-blue-600 text-white rounded-md py-2 font-medium text-center hover:bg-blue-700"
                  >
                    Join Waitlist
                  </button>
                </div>
                <div className="px-6 pt-6 pb-8 bg-white">
                  <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">What's included</h4>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex space-x-3">
                        <Zap className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="text-base text-gray-500">{feature}</span>
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Join Our Waitlist</h2>
              <button 
                onClick={() => setShowWaitlistForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              {submitError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                  {submitError}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Jane Doe"
                />
              </div>
              
              <div>
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Plan
                </label>
                <select
                  id="plan"
                  value={preferredPlan}
                  onChange={(e) => setPreferredPlan(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1">Free Plan - $0/month</option>
                  <option value="2">Premium Plan - $9.99/month</option>
                  <option value="3">Pro Plan - $19.99/month</option>
                </select>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 