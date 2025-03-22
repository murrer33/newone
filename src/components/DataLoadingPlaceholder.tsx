import React from 'react';
import { RefreshCw } from 'lucide-react';

interface DataLoadingPlaceholderProps {
  isLoading: boolean;
  isEmpty: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  children: React.ReactNode;
}

const DataLoadingPlaceholder: React.FC<DataLoadingPlaceholderProps> = ({
  isLoading,
  isEmpty,
  loadingMessage = 'Loading data...',
  emptyMessage = 'No data available. Please try refreshing.',
  children
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center flex items-center justify-center">
        <RefreshCw className="h-5 w-5 mr-2 animate-spin text-gray-500" />
        <p className="text-gray-500 dark:text-gray-400">{loadingMessage}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default DataLoadingPlaceholder; 