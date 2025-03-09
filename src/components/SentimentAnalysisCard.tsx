import React from 'react';
import { SentimentAnalysis } from '../types';
import { MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import SentimentChart from './SentimentChart';

interface SentimentAnalysisCardProps {
  data: SentimentAnalysis;
}

const SentimentAnalysisCard: React.FC<SentimentAnalysisCardProps> = ({ data }) => {
  const { overall, breakdown, trending } = data;
  
  const getSentimentColor = (score: number) => {
    if (score > 30) return 'text-green-500';
    if (score < -30) return 'text-red-500';
    return 'text-yellow-500';
  };
  
  const getSentimentIcon = (score: number) => {
    if (score > 30) return <TrendingUp className="h-5 w-5" />;
    if (score < -30) return <TrendingDown className="h-5 w-5" />;
    return <Minus className="h-5 w-5" />;
  };
  
  const getSentimentText = (score: number) => {
    if (score > 60) return 'Very Positive';
    if (score > 30) return 'Positive';
    if (score > 10) return 'Slightly Positive';
    if (score > -10) return 'Neutral';
    if (score > -30) return 'Slightly Negative';
    if (score > -60) return 'Negative';
    return 'Very Negative';
  };
  
  const getProgressBarColor = (score: number) => {
    if (score > 30) return 'bg-green-500';
    if (score < -30) return 'bg-red-500';
    return 'bg-yellow-500';
  };
  
  // Convert score from -100 to 100 range to 0 to 100 for progress bar
  const normalizedScore = (overall + 100) / 2;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Social Media Sentiment</h2>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Sentiment</span>
          <div className={`flex items-center ${getSentimentColor(overall)}`}>
            {getSentimentIcon(overall)}
            <span className="ml-1 font-medium">{getSentimentText(overall)}</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${getProgressBarColor(overall)}`} 
            style={{ width: `${normalizedScore}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">Sentiment by Platform</h3>
        <SentimentChart data={breakdown} />
      </div>
      
      <div>
        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">Trending Topics</h3>
        <div className="flex flex-wrap gap-2">
          {trending.map((topic, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
            >
              #{topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysisCard;