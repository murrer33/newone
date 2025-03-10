import React from 'react';
import { StockData } from '../types';
import StockCard from './StockCard'; // Correct import

interface MarketOverviewProps {
  stocks: StockData[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ stocks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stocks.map((stock) => (
        <StockCard key={stock.symbol} stock={stock} />
      ))}
    </div>
  );
};

export default MarketOverview;
