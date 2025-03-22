import React from 'react';
import { Clock } from 'lucide-react';

interface MarketStatusProps {
  isOpen: boolean | null;
  holiday?: string | null;
}

const MarketStatus: React.FC<MarketStatusProps> = ({ isOpen, holiday }) => {
  // Handle loading state (when isOpen is null)
  if (isOpen === null) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center">
        <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
          <Clock className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Market Status</p>
          <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center">
      <div className={`p-3 rounded-full ${isOpen 
        ? 'bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400' 
        : 'bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400'}`}>
        <Clock className="h-6 w-6" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Market Status</p>
        <p className={`text-lg font-semibold ${isOpen 
          ? 'text-green-500 dark:text-green-400' 
          : 'text-red-500 dark:text-red-400'}`}>
          {isOpen ? 'Market Open' : 'Market Closed'}
        </p>
        {!isOpen && holiday && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Holiday: {holiday}
          </p>
        )}
      </div>
    </div>
  );
};

export default MarketStatus; 