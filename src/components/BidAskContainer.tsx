import React from 'react';
import { useBidAsk } from '../hooks/useBidAsk';
import BidAskDisplay from './BidAskDisplay';
import BidAskChart from './BidAskChart';
import DataLoadingPlaceholder from './DataLoadingPlaceholder';

interface BidAskContainerProps {
  symbol: string;
}

const BidAskContainer: React.FC<BidAskContainerProps> = ({ symbol }) => {
  const {
    currentData,
    historyData,
    loading,
    error,
    isMarketOpen,
    lastUpdated,
    refreshData
  } = useBidAsk(symbol);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Bid/Ask Analysis
      </h2>
      
      <DataLoadingPlaceholder
        isLoading={loading && !currentData}
        isEmpty={false}
        loadingMessage="Loading bid/ask data..."
      >
        <BidAskDisplay
          data={currentData}
          loading={loading}
          error={error}
          isMarketOpen={isMarketOpen}
          lastUpdated={lastUpdated}
          onRefresh={refreshData}
        />
      </DataLoadingPlaceholder>
      
      <DataLoadingPlaceholder
        isLoading={loading && historyData.length === 0}
        isEmpty={false}
        loadingMessage="Loading bid/ask chart..."
      >
        <BidAskChart
          data={historyData}
          loading={loading}
          error={error}
        />
      </DataLoadingPlaceholder>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Understanding Bid/Ask Data
        </h3>
        <div className="text-gray-700 dark:text-gray-300 space-y-2">
          <p><strong>Bid Price:</strong> The highest price that a buyer is willing to pay for the stock.</p>
          <p><strong>Ask Price:</strong> The lowest price that a seller is willing to accept for the stock.</p>
          <p><strong>Spread:</strong> The difference between the ask price and the bid price.</p>
          <p><strong>Volume:</strong> The number of shares available at the bid and ask prices.</p>
        </div>
        <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
          <p>A narrower spread typically indicates higher liquidity and lower transaction costs. Real-time bid/ask data is most relevant during market hours. When markets are closed, the displayed prices reflect the latest available data from the most recent trading session.</p>
        </div>
      </div>
    </div>
  );
};

export default BidAskContainer; 