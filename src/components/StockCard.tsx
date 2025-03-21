import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StockData, Stock } from '../types';

// Define the market status type matching the context
interface MarketStatus {
  isOpen: boolean | null;
  holiday: string | null;
  loading: boolean;
  error: string | null;
}

interface StockCardProps {
  stock: Stock | StockData;
  marketStatus?: MarketStatus;
}

const StockCard: React.FC<StockCardProps> = ({ stock, marketStatus }) => {
  const { symbol, name, price } = stock;
  
  // If it's a StockData, it will have these properties, otherwise default to reasonable values
  const change = 'change' in stock ? stock.change : 0;
  const changePercent = 'changePercent' in stock ? stock.changePercent : 0;

  // Ensure values are defined before using .toFixed()
  const formattedPrice = price ? price.toFixed(2) : '0.00';
  const formattedChange = change ? change.toFixed(2) : '0.00';
  const formattedChangePercent = changePercent ? changePercent.toFixed(2) : '0.00';

  // Determine if the change is positive
  const isPositive = (change || 0) >= 0;

  // Create a price type message based on market status
  const getPriceTypeLabel = () => {
    if (!marketStatus || marketStatus.isOpen === null) return null;
    return marketStatus.isOpen ? 'Real-time' : 'Last close';
  };

  return (
    <Link to={`/stock/${symbol}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{symbol}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{name}</p>
          </div>
          <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${formattedPrice}</p>
            {marketStatus && (
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                {getPriceTypeLabel()}
              </span>
            )}
          </div>
          <div className="flex items-center mt-1">
            <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{formattedChange} ({isPositive ? '+' : ''}{formattedChangePercent}%)
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Ensure this is the default export
export default StockCard;
