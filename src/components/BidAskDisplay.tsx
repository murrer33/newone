import React from 'react';
import { BidAskData } from '../hooks/useBidAsk';
import { RefreshCw } from 'lucide-react';

interface BidAskDisplayProps {
  data: BidAskData | null;
  loading: boolean;
  error: string | null;
  isMarketOpen: boolean | null;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

const BidAskDisplay: React.FC<BidAskDisplayProps> = ({
  data,
  loading,
  error,
  isMarketOpen,
  lastUpdated,
  onRefresh
}) => {
  // Format currency with 2 decimal places
  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format volume with commas
  const formatVolume = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Format last updated time
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  // Market status message
  const getMarketStatusMessage = () => {
    if (isMarketOpen === null) return 'Market status unknown';
    return isMarketOpen ? 'Market is open' : 'Market is closed';
  };

  // Get status indicator color
  const getStatusColor = () => {
    if (isMarketOpen === null) return 'bg-gray-400';
    return isMarketOpen ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bid/Ask Data</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full ${getStatusColor()} mr-2`}></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{getMarketStatusMessage()}</span>
          </div>
          <button 
            onClick={onRefresh}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md p-4">
          <div className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-1">Bid</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {loading ? (
              <div className="h-7 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : (
              formatCurrency(data?.bidPrice || null)
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Volume: {loading ? (
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded inline-block"></div>
            ) : (
              formatVolume(data?.bidVolume || null)
            )}
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md p-4">
          <div className="text-sm text-red-700 dark:text-red-400 font-medium mb-1">Ask</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {loading ? (
              <div className="h-7 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : (
              formatCurrency(data?.askPrice || null)
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Volume: {loading ? (
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded inline-block"></div>
            ) : (
              formatVolume(data?.askVolume || null)
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 rounded-md p-4">
        <div className="flex justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Spread:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {loading ? (
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded inline-block"></div>
              ) : (
                data?.spread ? `$${data.spread}` : 'N/A'
              )}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {formatLastUpdated(lastUpdated)}
          </div>
        </div>
      </div>
      
      {!isMarketOpen && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
          * Displaying the latest available bid/ask prices from the most recent trading session.
        </div>
      )}
    </div>
  );
};

export default BidAskDisplay; 