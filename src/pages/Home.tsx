import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LineChart, BarChart3, TrendingUp, BarChart, Zap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Import logo if available in assets
import logo from '../assets/logo.svg';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-indigo-900/60 to-gray-900/80"></div>
        </div>
        
        {/* Navigation */}
        <nav className="relative z-10 px-6 py-6 lg:px-8">
          <div className="flex items-center justify-between mx-auto max-w-7xl">
            <div className="flex items-center">
              <img src={logo} alt="FinPulses" className="h-10 md:h-12" />
              <span className="ml-3 text-xl font-bold text-white">FinPulses</span>
            </div>
            <div className="flex space-x-2 md:space-x-4">
              <Link 
                to="/pricing" 
                className="px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-white/10 transition-colors"
              >
                Pricing
              </Link>
              <Link 
                to="/faq" 
                className="px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-white/10 transition-colors"
              >
                FAQ
              </Link>
              {user ? (
                <Link 
                  to="/dashboard" 
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative flex flex-col items-center px-6 py-24 mx-auto text-center max-w-7xl lg:py-32">
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            <span className="block">AI-Powered</span>
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
              Stock Market Predictions
            </span>
          </h1>
          <p className="max-w-2xl mt-6 text-xl text-gray-300">
            Make smarter investment decisions with our AI-powered stock analysis platform.
            Get real-time insights, predictions, and custom recommendations.
          </p>
          <div className="flex flex-col justify-center w-full gap-4 mt-10 sm:flex-row sm:max-w-lg">
            <Link
              to="/demo-stock"
              className="flex items-center justify-center px-8 py-4 text-base font-medium text-blue-700 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all"
            >
              Try Demo <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Join Waitlist <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 mt-16 md:grid-cols-4 lg:mt-24">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-white">95%</div>
              <div className="mt-2 text-sm text-blue-200">Prediction Accuracy</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-white">10K+</div>
              <div className="mt-2 text-sm text-blue-200">Active Users</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-white">500+</div>
              <div className="mt-2 text-sm text-blue-200">Supported Stocks</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-white">24/7</div>
              <div className="mt-2 text-sm text-blue-200">Real-time Updates</div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#F9FAFB" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,218.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Advanced Features for Smart Investors
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              FinPulses combines artificial intelligence with deep market analysis to give you the edge in your investment decisions.
            </p>
          </div>
          
          <div className="grid max-w-5xl grid-cols-1 mx-auto mt-16 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-blue-100">
                <LineChart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Price Predictions</h3>
              <p className="mt-2 text-gray-600">
                Our AI models analyze historical data and market sentiment to predict future stock movements with high accuracy.
              </p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-blue-100">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Technical Analysis</h3>
              <p className="mt-2 text-gray-600">
                Get comprehensive technical indicators and patterns detection to inform your trading strategies.
              </p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-blue-100">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Trend Identification</h3>
              <p className="mt-2 text-gray-600">
                Identify emerging market trends before they become obvious to the majority of investors.
              </p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-blue-100">
                <BarChart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sentiment Analysis</h3>
              <p className="mt-2 text-gray-600">
                Analyze news, social media, and market sentiment to gauge investor emotions and their impact on stocks.
              </p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-blue-100">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Real-time Alerts</h3>
              <p className="mt-2 text-gray-600">
                Get instant notifications about significant price movements, pattern formations, or unusual activity.
              </p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-blue-100">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
              <p className="mt-2 text-gray-600">
                Evaluate potential risks and rewards with our advanced risk assessment tools and portfolio analysis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              What Our Users Say
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join thousands of investors who are already benefiting from our AI-powered predictions.
            </p>
          </div>
          <div className="grid max-w-4xl grid-cols-1 mx-auto mt-16 gap-8 sm:grid-cols-2">
            <div className="p-6 bg-white rounded-xl shadow-sm ring-1 ring-gray-200">
              <p className="text-gray-700">
                "FinPulses has completely transformed how I approach stock investments. The AI predictions have been remarkably accurate and helped me maximize my returns."
              </p>
              <div className="flex items-center mt-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Michael K.</p>
                  <p className="text-sm text-gray-500">Day Trader</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm ring-1 ring-gray-200">
              <p className="text-gray-700">
                "The technical analysis tools are outstanding. I can quickly identify trends and patterns that would have taken hours to spot manually."
              </p>
              <div className="flex items-center mt-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-full"></div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Sarah L.</p>
                  <p className="text-sm text-gray-500">Portfolio Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="px-6 py-12 mx-auto max-w-4xl bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl sm:py-16 sm:px-12 lg:flex lg:items-center lg:gap-8">
            <div className="max-w-xl mx-auto text-center lg:text-left lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to revolutionize your investment strategy?
              </h2>
              <p className="mt-4 text-lg text-indigo-100">
                Join our waitlist today and be among the first to experience the future of AI-powered stock predictions.
              </p>
              <div className="flex flex-col items-center justify-center mt-8 lg:justify-start sm:flex-row sm:gap-4">
                <Link
                  to="/demo-stock"
                  className="flex items-center justify-center w-full px-8 py-3 mb-4 text-base font-medium text-blue-700 bg-white rounded-md shadow-sm hover:bg-gray-100 sm:w-auto sm:mb-0"
                >
                  Try Demo <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-blue-800 rounded-md shadow-sm hover:bg-blue-900 sm:w-auto"
                >
                  Join Waitlist <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            <div className="flex items-center">
              <img src={logo} alt="FinPulses" className="h-8" />
              <span className="ml-2 text-xl font-bold text-white">FinPulses</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-8 md:mt-0">
              <Link 
                to="/pricing" 
                className="text-sm text-gray-400 hover:text-white"
              >
                Pricing
              </Link>
              <Link 
                to="/faq" 
                className="text-sm text-gray-400 hover:text-white"
              >
                FAQ
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-gray-400 hover:text-white"
              >
                Terms of Service
              </Link>
              <Link 
                to="/privacy" 
                className="text-sm text-gray-400 hover:text-white"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="pt-8 mt-8 text-sm text-center text-gray-500 border-t border-gray-800">
            &copy; {new Date().getFullYear()} FinPulses.tech. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Join the Waitlist</h2>
            <p className="mt-2 text-gray-600">
              Be the first to access our AI-powered stock prediction platform when it launches.
            </p>
            <form className="mt-6">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name (optional)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 mt-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Join Waitlist
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 