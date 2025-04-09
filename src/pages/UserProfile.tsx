import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToken } from '../context/TokenContext';
import QuestItem from '../components/QuestItem';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { userData, quests, loading } = useToken();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  const handleUpdateProfile = async () => {
    // Profile update would be implemented here
    setIsEditing(false);
  };

  const getCompletedQuestsCount = () => {
    if (!userData?.completedQuests) return 0;
    return Object.keys(userData.completedQuests).length;
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