import React from 'react';
import { StockData, Stock } from '../types';
import StockCard from './StockCard'; // Correct import

interface MarketOverviewProps {
  stocks: (StockData | Stock)[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ stocks }) => {
  // Convert any Stock objects to StockData objects
  const stockDataArray: StockData[] = stocks.map(stock => {
    // Check if it's already a StockData object
    if ('change' in stock && 'changePercent' in stock && 'volume' in stock && 'marketCap' in stock) {
      return stock as StockData;
    }
    
    // Convert Stock to StockData
    return {
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: 0,
      changePercent: 0,
      volume: 0,
      marketCap: 0
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stockDataArray.map((stock) => (
        <StockCard key={stock.symbol} stock={stock} />
      ))}
    </div>
  );
};

export default MarketOverview;
