import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToken } from '../context/TokenContext';
import QuestItem from '../components/QuestItem';
import { getReferralLink } from '../services/tokenService';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { userData, quests, loading, submitUserFeedback, addUserTokens } = useToken();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  
  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);
  
  // Ad watching state
  const [watchingAd, setWatchingAd] = useState<boolean>(false);
  const [adCompleted, setAdCompleted] = useState<boolean>(false);
  const [adCooldown, setAdCooldown] = useState<boolean>(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  
  // Referral state
  const [referralLink, setReferralLink] = useState<string>('');
  const [referralCopied, setReferralCopied] = useState<boolean>(false);
  
  // Generate referral link when user data is loaded
  useEffect(() => {
    if (userData?.referralId) {
      setReferralLink(getReferralLink(userData.referralId));
    }
  }, [userData]);

  const handleUpdateProfile = async () => {
    // Profile update would be implemented here
    setIsEditing(false);
  };

  const getCompletedQuestsCount = () => {
    if (!userData?.completedQuests) return 0;
    return Object.keys(userData.completedQuests).length;
  };
  
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackRating === 0) return;
    
    setSubmittingFeedback(true);
    try {
      const result = await submitUserFeedback(feedbackRating, feedbackComment);
      if (result) {
        setFeedbackSuccess(true);
        setFeedbackRating(0);
        setFeedbackComment('');
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setFeedbackSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmittingFeedback(false);
    }
  };
  
  const handleWatchAd = () => {
    setWatchingAd(true);
    
    // Simulate ad playback (replace with actual ad integration)
    setTimeout(async () => {
      setWatchingAd(false);
      setAdCompleted(true);
      
      // Reward user with tokens
      await addUserTokens(5);
      
      // Start cooldown timer
      setAdCooldown(true);
      setCooldownTime(30);
      
      // Cooldown countdown
      const timer = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setAdCooldown(false);
            setAdCompleted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 5000); // Simulate a 5-second ad
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:mr-6 mb-4 md:mb-0 flex-shrink-0">
              <img 
                src={user?.photoURL || 'https://via.placeholder.com/100'} 
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                  />
                  <div className="mt-2 flex space-x-2 justify-center md:justify-start">
                    <button
                      onClick={handleUpdateProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{user?.displayName || 'User'}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
            <div className="mt-4 md:mt-0 bg-blue-100 dark:bg-blue-900 p-4 rounded-lg text-center">
              <p className="text-sm text-blue-700 dark:text-blue-300">Available Tokens</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{userData?.tokens || 0}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Joined</p>
            <p className="text-xl font-semibold">
              {userData?.createdAt 
                ? new Date(userData.createdAt).toLocaleDateString() 
                : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Quests Completed</p>
            <p className="text-xl font-semibold">{getCompletedQuestsCount()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Last Feedback</p>
            <p className="text-xl font-semibold">
              {userData?.lastFeedback 
                ? new Date(userData.lastFeedback).toLocaleDateString() 
                : 'None'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Account Type</p>
            <p className="text-xl font-semibold">Standard</p>
          </div>
        </div>
        
        {/* Referral Section */}
        <div id="referral" className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Invite Friends & Earn Tokens</h2>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">Your Referral Program</h3>
                <p className="text-white/80 mb-2">
                  Share your referral link with friends and earn 50 tokens for each person who signs up!
                </p>
                <div className="flex items-center text-sm font-semibold mb-1">
                  <svg className="h-5 w-5 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  <span>Your Referral ID: <span className="font-bold">{userData?.referralId || 'Loading...'}</span></span>
                </div>
                <div className="flex items-center text-sm font-semibold">
                  <svg className="h-5 w-5 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Total Referrals: <span className="font-bold">{userData?.referralCount || 0}</span></span>
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="w-full md:w-72 px-3 py-3 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none"
                  />
                  <button
                    onClick={copyReferralLink}
                    className={`absolute right-1 top-1 bottom-1 px-3 rounded-md font-medium transition-colors ${
                      referralCopied ? 'bg-green-500 text-white' : 'bg-white text-purple-700 hover:bg-yellow-300 hover:text-purple-800'
                    }`}
                  >
                    {referralCopied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
                <div className="flex justify-center mt-3 space-x-3">
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Share your unique referral link with friends</li>
              <li>Your friends sign up using your referral link</li>
              <li>You earn 50 tokens for each friend who creates an account</li>
              <li>Your friends also get 10 bonus tokens for signing up via a referral</li>
            </ol>
          </div>
        </div>
        
        {/* Gain Tokens Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Gain Tokens</h2>
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">Watch Ads, Earn Tokens!</h3>
                <p className="text-white/80 mb-2">Watch a short advertisement and earn 5 tokens each time.</p>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold">Maximum of 10 ads per day</span>
                </div>
              </div>
              
              <div className="text-center">
                {watchingAd ? (
                  <div className="bg-white/20 p-4 rounded-lg text-center w-64">
                    <div className="animate-pulse mb-2">
                      <svg className="w-12 h-12 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="font-semibold">Ad playing...</p>
                    <p className="text-sm mt-1 text-white/80">Please wait, your reward is coming!</p>
                    <div className="w-full bg-white/30 h-2 mt-3 rounded-full overflow-hidden">
                      <div className="bg-white h-full rounded-full animate-[progress_5s_linear_1]"></div>
                    </div>
                  </div>
                ) : adCompleted ? (
                  <div className="bg-green-500/20 p-4 rounded-lg text-center w-64">
                    <svg className="w-12 h-12 mx-auto text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-semibold mt-2">Thank you!</p>
                    <p className="text-sm mt-1 text-white/80">You've earned 5 tokens!</p>
                  </div>
                ) : (
                  <button
                    onClick={handleWatchAd}
                    disabled={adCooldown}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                      adCooldown
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-white text-purple-700 hover:bg-yellow-300 hover:text-purple-800'
                    }`}
                  >
                    {adCooldown ? `Wait ${cooldownTime}s` : 'Watch Ad (+5 Tokens)'}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold">Complete Daily Quests</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Complete various activities to earn tokens each day.</p>
              <button className="mt-2 text-blue-600 text-sm hover:underline">View Quests</button>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold">Invite Friends</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Earn 50 tokens for each friend who signs up using your referral code.</p>
              <button className="mt-2 text-blue-600 text-sm hover:underline">Get Referral Link</button>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Give Feedback</h2>
          {feedbackSuccess ? (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
              <div className="flex">
                <div className="py-1">
                  <svg className="h-5 w-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Thank you for your feedback!</p>
                  <p className="text-sm">You've earned 10 tokens for your participation.</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rate your experience:
                </label>
                <div className="flex space-x-3 mb-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFeedbackRating(value)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        feedbackRating >= value
                          ? 'bg-yellow-400 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      } hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
                    >
                      <span className="text-lg">{value}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="feedback-comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional comments (optional):
                </label>
                <textarea
                  id="feedback-comment"
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Please share your thoughts..."
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={feedbackRating === 0 || submittingFeedback}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback & Earn 10 Tokens'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Daily Quests */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Daily Quests</h2>
          <div className="grid gap-4">
            {quests.length > 0 ? (
              quests.map(quest => (
                <QuestItem 
                  key={quest.id}
                  quest={quest}
                  isCompleted={!!userData?.completedQuests?.[quest.id]?.rewarded}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No quests available at the moment. Check back later!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 