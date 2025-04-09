import React from 'react';
import { Quest } from '../types/User';
import { useToken } from '../context/TokenContext';

interface QuestItemProps {
  quest: Quest;
  isCompleted: boolean;
}

const QuestItem: React.FC<QuestItemProps> = ({ quest, isCompleted }) => {
  const { completeUserQuest } = useToken();

  const handleCompleteQuest = async () => {
    if (!isCompleted) {
      await completeUserQuest(quest.id);
    }
  };

  // Format the expiration date
  const formatExpirationDate = () => {
    if (!quest.expiresAt) return 'No expiration';
    
    const expireDate = new Date(quest.expiresAt);
    const now = new Date();
    
    // If expires today, show hours remaining
    if (expireDate.toDateString() === now.toDateString()) {
      const hoursRemaining = Math.max(0, Math.floor((expireDate.getTime() - now.getTime()) / (1000 * 60 * 60)));
      return `${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''} left`;
    }
    
    // Otherwise show the date
    return `Expires ${expireDate.toLocaleDateString()}`;
  };

  return (
    <div className={`border rounded-lg p-4 ${isCompleted ? 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700' : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center">
            <h3 className={`font-semibold text-lg ${isCompleted ? 'text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
              {quest.title}
            </h3>
            {isCompleted && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full dark:bg-green-900 dark:text-green-200">
                Completed
              </span>
            )}
          </div>
          <p className={`text-sm ${isCompleted ? 'text-gray-500 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
            {quest.description}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {formatExpirationDate()}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium dark:bg-yellow-900/50 dark:text-yellow-200">
            +{quest.tokenReward} tokens
          </div>
          {!isCompleted && (
            <button
              onClick={handleCompleteQuest}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={quest.requirement.type !== 'login' && quest.requirement.type !== 'feedback'}
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestItem; 