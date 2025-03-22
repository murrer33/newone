import React from 'react';
import { RefreshCw, Clock, AlertCircle } from 'lucide-react';
import MarketStatus from './MarketStatus';

interface MarketStatusHeaderProps {
  title: string;
  loading: boolean;
  error: string | null;
  marketStatus: {
    isOpen: boolean | null;
    holiday: string | null;
    loading: boolean;
    error: string | null;
  };
  lastUpdated: Date | null;
  onRefresh: () => void;
}

const formatDateTime = (date: Date | null) => {
  if (!date) return 'Never';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const MarketStatusHeader: React.FC<MarketStatusHeaderProps> = ({
  title,
  loading,
  error,
  marketStatus,
  lastUpdated,
  onRefresh
}) => {
  return (
    <>
      {/* Header with title and refresh button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        
        <div className="flex items-center">
          <div className="flex items-center mr-4 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span>Last updated: {formatDateTime(lastUpdated)}</span>
          </div>
          <button 
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Messages (as warnings, not blocking content) */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-200 rounded-md text-yellow-700 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <div>
            <p className="font-medium">Warning: Some data might be outdated</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Market Status */}
      <div className="mb-8">
        <MarketStatus 
          isOpen={marketStatus.isOpen} 
          holiday={marketStatus.holiday} 
        />
      </div>
    </>
  );
};

export default MarketStatusHeader; 