import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { submitToGoogleForm } from '../utils/googleFormsIntegration';
import logo from '../assets/logo.svg';

const WaitlistPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [preferredPlan, setPreferredPlan] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 9.99,
      features: [
        'AI-powered stock predictions',
        'Basic technical indicators',
        'Daily market updates',
        'Limited API calls'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 19.99,
      features: [
        'Everything in Basic',
        'Advanced technical indicators',
        'Real-time market data',
        'Portfolio tracking',
        'Priority support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 29.99,
      features: [
        'Everything in Pro',
        'Custom AI models',
        'Unlimited API calls',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced risk assessment'
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
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
      
      // Also submit the data to Google Forms
      const googleFormSubmitted = await submitToGoogleForm({
        email,
        name,
        preferredPlan,
        additionalInfo: `Submitted on ${new Date().toISOString()}`
      });
      
      if (insertError) {
        console.error('Error joining waitlist:', insertError);
        
        if (googleFormSubmitted) {
          // If Supabase fails but Google Forms works, still count it as a success
          setSubmitSuccess(true);
          setEmail('');
          setName('');
          setPreferredPlan('basic');
        } else {
          setError('Failed to join waitlist. Please try again later or contact support.');
          
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
        }
      } else {
        setSubmitSuccess(true);
        // Reset form
        setEmail('');
        setName('');
        setPreferredPlan('basic');
      }
    } catch (err) {
      console.error('Error submitting to waitlist:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-blue-900">
      {/* Header */}
      <header className="px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="FinPulses" className="h-8" />
            <span className="ml-2 text-xl font-bold text-white">FinPulses</span>
          </Link>
          <nav className="flex space-x-4">
            <Link to="/demo-stock" className="text-white hover:text-blue-300 text-sm font-medium">
              Try Demo
            </Link>
            <Link to="/login" className="text-white hover:text-blue-300 text-sm font-medium">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {submitSuccess ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="mt-6 text-2xl font-bold text-center text-gray-900">
                You're on the waitlist!
              </h1>
              <p className="mt-4 text-center text-gray-600">
                Thank you for joining our waitlist! We're excited to share FinPulses with you when it's ready. 
                We'll notify you at your email address when you've been granted access.
              </p>
              <div className="mt-8 flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Back to Home
                </Link>
                <Link 
                  to="/demo-stock" 
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Try Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-white tracking-tight sm:text-5xl">
                Join the Future of Stock Analysis
              </h1>
              <p className="mt-6 text-xl text-blue-100">
                Be among the first to access our AI-powered stock prediction platform. Sign up for our waitlist to get early access and exclusive offers.
              </p>
              
              <div className="mt-12 space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-200">
                    <Check className="w-5 h-5 text-blue-700" />
                  </div>
                  <p className="ml-4 text-blue-100">Advanced AI-powered stock predictions</p>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-200">
                    <Check className="w-5 h-5 text-blue-700" />
                  </div>
                  <p className="ml-4 text-blue-100">Real-time market data and analysis</p>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-200">
                    <Check className="w-5 h-5 text-blue-700" />
                  </div>
                  <p className="ml-4 text-blue-100">Technical indicators and sentiment analysis</p>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-200">
                    <Check className="w-5 h-5 text-blue-700" />
                  </div>
                  <p className="ml-4 text-blue-100">Priority access to new features</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-8">
                  <h2 className="text-2xl font-bold text-gray-900">Join the Waitlist</h2>
                  <p className="mt-2 text-gray-600">
                    Sign up to be notified when we launch and get early access to our platform.
                  </p>
                  
                  <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name (optional)
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                        Select a plan
                      </label>
                      <div className="mt-4 space-y-4">
                        {plans.map((plan) => (
                          <div key={plan.id} className="relative">
                            <div 
                              className={`
                                border rounded-lg p-4 cursor-pointer
                                ${preferredPlan === plan.id 
                                  ? 'border-indigo-500 ring-2 ring-indigo-500' 
                                  : 'border-gray-300 hover:border-indigo-300'}
                              `}
                              onClick={() => setPreferredPlan(plan.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                                  <p className="mt-1 text-gray-500">${plan.price}/month</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${preferredPlan === plan.id ? 'bg-indigo-500 border-transparent' : 'border-gray-300'}`}>
                                  {preferredPlan === plan.id && <Check className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                              <ul className="mt-2 space-y-1">
                                {plan.features.slice(0, 2).map((feature, index) => (
                                  <li key={index} className="flex items-center text-sm text-gray-500">
                                    <ChevronRight className="mr-2 h-3 w-3 text-indigo-400" />
                                    {feature}
                                  </li>
                                ))}
                                {plan.features.length > 2 && (
                                  <li className="text-sm text-gray-500">And {plan.features.length - 2} more features</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {error && (
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                        {error}
                      </div>
                    )}
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          'Join Waitlist'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistPage; 