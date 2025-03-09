import React from 'react';
import { NewsItem } from '../types';
import { MessageCircle, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

interface NewsAnalysisProps {
  news: NewsItem[];
}

const NewsAnalysis: React.FC<NewsAnalysisProps> = ({ news }) => {
  const getSentimentIcon = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral':
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">High Impact</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium Impact</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Low Impact</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <MessageCircle className="h-5 w-5 text-blue-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">News Analysis</h2>
      </div>
      
      <div className="space-y-4">
        {news.length > 0 ? (
          news.map((item, index) => (
            <div key={index} className="flex items-start space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4">
              <img src={item.image} alt={item.title} className="w-16 h-16 rounded-md object-cover" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                  <div className="flex items-center ml-2">
                    {getSentimentIcon(item.sentiment)}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.source} • {item.time}</p>
                  {getImpactBadge(item.impact)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No news available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsAnalysis;