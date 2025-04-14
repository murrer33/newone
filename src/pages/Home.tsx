import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Shield, Zap, ChevronRight, ArrowRight } from 'lucide-react';
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
  const [activeCard, setActiveCard] = useState<string | null>(null);

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setSubmitError('Email is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Try to add to waitlist table
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
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-blue-900">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1640340434771-5e72dc61728a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80" 
            alt="Stock market chart"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-transparent"></div>
        </div>
        <div className="relative px-4 py-32 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">
              AI-Powered Stock Predictions
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-200 max-w-3xl leading-relaxed drop-shadow">
            Finpulses.tech uses advanced machine learning algorithms to analyze market trends and provide accurate stock predictions to help you make better investment decisions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-5 w-full max-w-md mx-auto">
            {submitSuccess ? (
              <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow-xl animate-fade-in">
                <p className="font-medium text-lg">You've joined our waitlist!</p>
                <p>We'll notify you when you get access.</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowWaitlistForm(true)}
                  className="px-8 py-4 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-xl w-full sm:w-auto"
                >
                  Join Waitlist
                </button>
                <Link
                  to="/demo-stock"
                  className="px-8 py-4 text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 shadow-lg transition-all duration-200 hover:translate-y-[-2px] hover:shadow-xl flex items-center justify-center w-full sm:w-auto"
                >
                  Try Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg transition-all duration-200 hover:translate-y-[-2px] hover:shadow-xl flex items-center justify-center w-full sm:w-auto"
                >
                  Login <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Finpulses?
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Get ahead in the market with our cutting-edge features
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-blue-600 mb-6 p-3 bg-blue-50 rounded-lg inline-flex">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Predictions</h3>
              <p className="text-gray-500 leading-relaxed">Advanced algorithms predict market trends with high accuracy, giving you insights before the market moves.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-blue-600 mb-6 p-3 bg-blue-50 rounded-lg inline-flex">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Analysis</h3>
              <p className="text-gray-500 leading-relaxed">Get insights from market experts and seasoned analysts who track market movements daily.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-blue-600 mb-6 p-3 bg-blue-50 rounded-lg inline-flex">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Risk Management</h3>
              <p className="text-gray-500 leading-relaxed">Advanced tools to help you manage and minimize risks through diversification strategies and alerts.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-blue-600 mb-6 p-3 bg-blue-50 rounded-lg inline-flex">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Updates</h3>
              <p className="text-gray-500 leading-relaxed">Get instant notifications about market changes and important stock movements as they happen.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Subscription Plans
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Choose the right plan for your investment needs
            </p>
          </div>

          <div className="mt-12 space-y-8 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8 lg:max-w-5xl lg:mx-auto">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`border border-gray-200 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 ${activeCard === plan.id ? 'scale-105 shadow-xl border-blue-200 ring-2 ring-blue-400' : 'hover:shadow-xl hover:scale-[1.02]'}`}
                onMouseEnter={() => setActiveCard(plan.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="p-8 bg-white">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-6 flex items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900">${plan.price}</span>
                    <span className="ml-2 text-base font-medium text-gray-500">/month</span>
                  </p>
                  <div className="mt-8 space-y-4">
                    <button
                      onClick={() => {
                        setPreferredPlan(plan.id.toString());
                        setShowWaitlistForm(true);
                      }}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg shadow-md font-semibold text-center transition-all duration-200 flex items-center justify-center"
                    >
                      Join Waitlist <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                    <Link
                      to="/demo-stock"
                      className="w-full py-3 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg shadow-sm font-semibold text-center transition-all duration-200 flex items-center justify-center"
                    >
                      Try Demo
                    </Link>
                    <Link
                      to="/login"
                      className="w-full py-3 px-4 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm font-semibold text-center transition-all duration-200 flex items-center justify-center"
                    >
                      Already have access? Login
                    </Link>
                  </div>
                </div>
                <div className="px-8 pt-6 pb-8 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">What's included</h4>
                  <ul className="mt-6 space-y-5">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Zap className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            <span className="block">Ready to boost your investments?</span>
            <span className="block mt-2 text-blue-200">Start using Finpulses today.</span>
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={() => setShowWaitlistForm(true)}
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-all duration-200 transform hover:translate-y-[-2px]"
              >
                Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 transform hover:translate-y-[-2px]"
              >
                Login <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Form Modal */}
      {showWaitlistForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Join the Waitlist</h2>
            <form onSubmit={handleWaitlistSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-3"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-3"
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
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-3"
                  >
                    {subscriptionPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} (${plan.price}/month)
                      </option>
                    ))}
                  </select>
                </div>
                {submitError && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
                    {submitError}
                  </div>
                )}
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowWaitlistForm(false)}
                    className="px-5 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 transition-colors flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Join Waitlist'
                    )}
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