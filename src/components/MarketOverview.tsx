import React from 'react';
import { StockData } from '../types';
import StockCard from './StockCard';

interface MarketOverviewProps {
  stocks: StockData[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ stocks }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Market Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map(stock => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;