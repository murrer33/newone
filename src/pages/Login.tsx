import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToken } from '../context/TokenContext';
import FeedbackModal from '../components/FeedbackModal';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginWithGoogle, error: authError } = useAuth();
  const { userData, completeUserQuest } = useToken();

  // Check for email verification success message
  useEffect(() => {
    const emailVerified = searchParams.get('email_confirmed');
    if (emailVerified === 'true') {
      setVerificationMessage('Your email has been verified! You can now log in.');
    }
  }, [searchParams]);

  // Set error from auth context
  useEffect(() => {
    if (authError) {
      const lowerCaseError = authError.toLowerCase();
      if (lowerCaseError.includes('email not confirmed')) {
        setError('Please verify your email before logging in. Check your inbox for a verification link.');
      } else {
        setError(authError);
      }
    }
  }, [authError]);

  // Check if feedback should be shown (less than 7 days since last feedback)
  useEffect(() => {
    if (userData) {
      const shouldShowFeedback = !userData.lastFeedback || 
        (Date.now() - userData.lastFeedback > 7 * 24 * 60 * 60 * 1000);
      
      // Only show feedback if we just logged in
      if (shouldShowFeedback && loading === false && error === null && email !== '') {
        // Delay showing feedback to let the dashboard load first
        setTimeout(() => {
          setShowFeedback(true);
        }, 1000);
        
        // Try to complete the login quest
        const loginQuestId = 'daily-login';
        if (userData.completedQuests && !userData.completedQuests[loginQuestId]) {
          completeUserQuest(loginQuestId);
        }
      }
    }
  }, [userData, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setVerificationMessage(null);
      setLoading(true);
      const user = await login(email, password);
      if (user) {
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      
      // Check for specific error conditions
      if (errorMessage.toLowerCase().includes('invalid login credentials')) {
        setError('Invalid email or password');
      } else if (errorMessage.toLowerCase().includes('email not confirmed')) {
        setError('Please verify your email before logging in. Check your inbox for a verification link.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setVerificationMessage(null);
      setLoading(true);
      await loginWithGoogle();
      // The redirect will happen in the Supabase OAuth flow
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        {verificationMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {verificationMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <img
                className="h-5 w-5 mr-2"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
              />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>

      <FeedbackModal 
        isOpen={showFeedback} 
        onClose={() => setShowFeedback(false)} 
      />
    </div>
  );
};

export default Login; 