import React from 'react';
import { TechnicalIndicator as TechnicalIndicatorType } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TechnicalIndicatorProps {
  indicator: TechnicalIndicatorType;
}

const TechnicalIndicator: React.FC<TechnicalIndicatorProps> = ({ indicator }) => {
  const { name, value, signal, description } = indicator;

  const getSignalColor = (signal: 'buy' | 'sell' | 'neutral') => {
    switch (signal) {
      case 'buy':
        return 'text-green-500';
      case 'sell':
        return 'text-red-500';
      case 'neutral':
        return 'text-gray-500';
    }
  };

  const getSignalIcon = (signal: 'buy' | 'sell' | 'neutral') => {
    switch (signal) {
      case 'buy':
        return <TrendingUp size={16} />;
      case 'sell':
        return <TrendingDown size={16} />;
      case 'neutral':
        return <Minus size={16} />;
    }
  };

  const formatValue = (value: number): string => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'N/A';
    }
    // If it's a whole number, don't show decimals
    if (Number.isInteger(value)) {
      return value.toString();
    }
    // Otherwise show up to 2 decimal places
    return value.toFixed(2);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-md font-bold text-gray-900 dark:text-white">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className={`flex items-center ${getSignalColor(signal)}`}>
          {getSignalIcon(signal)}
          <span className="ml-1 font-medium capitalize">{signal}</span>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {formatValue(value)}
        </p>
      </div>
    </div>
  );
};

export default TechnicalIndicator;