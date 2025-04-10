import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { getCurrentUserWaitlistStatus } from '../utils/waitlistCheck';
import { Link } from 'react-router-dom';

const WaitlistPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [waitPosition, setWaitPosition] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isWaitlisted, setIsWaitlisted] = useState<boolean>(true);
  const [referralCode, setReferralCode] = useState<string>('');
  const [joinEmail, setJoinEmail] = useState<string>('');
  const [joinName, setJoinName] = useState<string>('');
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [joinSuccess, setJoinSuccess] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // User is authenticated
        setIsAuthenticated(true);
        
        // Set user ID
        setUserId(session.user.id);
        
        // Get user profile data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email, display_name, referral_id, waitlist_position')
          .eq('uid', session.user.id)
          .single();

        if (userError) throw userError;

        if (userData) {
          setEmail(userData.email || '');
          setName(userData.display_name || '');
          setWaitPosition(userData.waitlist_position || null);
          setReferralCode(userData.referral_id || '');
        }

        // Check waitlist status
        const waitlisted = await getCurrentUserWaitlistStatus();
        setIsWaitlisted(waitlisted);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinEmail) {
      setJoinError('Email is required');
      return;
    }
    
    try {
      setIsJoining(true);
      setJoinError(null);
      
      // First, check if the email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('waitlist')
        .select('email')
        .eq('email', joinEmail)
        .maybeSingle();
      
      if (existingUser) {
        setJoinError('This email is already on the waitlist');
        return;
      }
      
      // Add to waitlist table (you need to create this table in Supabase)
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([
          { 
            email: joinEmail, 
            name: joinName,
            joined_at: new Date().toISOString(),
            referral_code: Math.random().toString(36).substring(2, 10).toUpperCase()
          }
        ]);
      
      if (insertError) throw insertError;
      
      setJoinSuccess(true);
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setJoinError('Failed to join waitlist. Please try again later.');
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Already authenticated but not waitlisted
  if (isAuthenticated && !isWaitlisted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Good news!</h1>
          <p className="text-gray-600 mb-6">
            You're no longer on the waitlist! You now have full access to the platform.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Authenticated and waitlisted
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">You're on the waitlist!</h1>
            <p className="text-gray-600">
              Thank you for your interest in our platform. We're currently in beta and are gradually giving access to users.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Your Status</h2>
            <div className="mb-4">
              <p className="text-gray-700 mb-1"><span className="font-medium">Name:</span> {name}</p>
              <p className="text-gray-700 mb-1"><span className="font-medium">Email:</span> {email}</p>
              {waitPosition && (
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Waitlist Position:</span> {waitPosition}
                </p>
              )}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Skip the Line!</h2>
            <p className="text-gray-700 mb-4">
              Refer friends to move up the waitlist. For each friend who joins using your referral link,
              you'll move up in the queue!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="flex-grow bg-white border border-gray-300 rounded-lg p-2 overflow-x-auto">
                <code className="text-sm whitespace-nowrap">{`${window.location.origin}/register?ref=${referralCode}`}</code>
              </div>
              <button
                onClick={copyReferralLink}
                className="bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 whitespace-nowrap"
              >
                Copy Link
              </button>
            </div>
          </div>

          <div className="text-center text-gray-600 text-sm">
            <p>
              We'll notify you by email when you're granted access. Thank you for your patience!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show join waitlist form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Our Waitlist</h1>
          <p className="text-gray-600">
            Get early access to our platform. We're currently in beta and gradually onboarding new users.
          </p>
        </div>

        {joinSuccess ? (
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">You're on the list!</h2>
            <p className="text-gray-700 mb-6">
              Thank you for joining our waitlist. We'll notify you by email when it's your turn to join!
            </p>
            <Link 
              to="/login" 
              className="inline-block bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleJoinWaitlist} className="space-y-6">
            {joinError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                {joinError}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={joinEmail}
                onChange={(e) => setJoinEmail(e.target.value)}
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
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Jane Doe"
              />
            </div>
            
            <button
              type="submit"
              disabled={isJoining}
              className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              {isJoining ? 'Joining...' : 'Join Waitlist'}
            </button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default WaitlistPage; 