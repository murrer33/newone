import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { getCurrentUserWaitlistStatus } from '../utils/waitlistCheck';

const WaitlistPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [waitPosition, setWaitPosition] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWaitlisted, setIsWaitlisted] = useState<boolean>(true);
  const [referralCode, setReferralCode] = useState<string>('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          return;
        }

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isWaitlisted) {
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
};

export default WaitlistPage; 