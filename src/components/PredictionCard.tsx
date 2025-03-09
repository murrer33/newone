import React from 'react';
import { StockPrediction } from '../types';
import { TrendingUp, TrendingDown, MoveHorizontal } from 'lucide-react';

interface PredictionCardProps {
  prediction: StockPrediction;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  const { timeframe, predictedPrice, confidence, direction } = prediction;

  const getDirectionColor = (direction: 'up' | 'down' | 'sideways') => {
    switch (direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'sideways':
        return 'text-yellow-500';
    }
  };

  const getDirectionIcon = (direction: 'up' | 'down' | 'sideways') => {
    switch (direction) {
      case 'up':
        return <TrendingUp size={16} />;
      case 'down':
        return <TrendingDown size={16} />;
      case 'sideways':
        return <MoveHorizontal size={16} />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'bg-green-500';
    if (confidence >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <h3 className="text-md font-bold text-gray-900 dark:text-white">{timeframe} Forecast</h3>
        <div className={`flex items-center ${getDirectionColor(direction)}`}>
          {getDirectionIcon(direction)}
          <span className="ml-1 font-medium capitalize">{direction}</span>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-xl font-bold text-gray-900 dark:text-white">${predictedPrice.toFixed(2)}</p>
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Confidence</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getConfidenceColor(confidence)}`} 
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">{confidence}%</p>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;