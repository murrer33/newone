import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

interface LivePriceDisplayProps {
  price: number;
  change: number;
  changePercent: number;
  lastUpdate?: string;
}

const LivePriceDisplay: React.FC<LivePriceDisplayProps> = ({
  price,
  change,
  changePercent,
  lastUpdate
}) => {
  const isPositive = change >= 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          ${price.toFixed(2)}
        </span>
        <div className={`ml-3 flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? (
            <TrendingUp className="h-5 w-5 mr-1" />
          ) : (
            <TrendingDown className="h-5 w-5 mr-1" />
          )}
          <span className="text-lg font-semibold">
            {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      {lastUpdate && (
        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Last updated: {format(new Date(lastUpdate), 'HH:mm:ss')}
        </span>
      )}
    </div>
  );
};

export default LivePriceDisplay;