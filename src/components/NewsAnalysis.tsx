import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'; // Import icons from lucide-react

interface NewsArticle {
  headline: string;
  summary: string;
  url: string;
  image?: string;
  source: string;
  datetime: number;
  impact: 'high-positive' | 'positive' | 'neutral' | 'negative' | 'high-negative';
}

interface NewsAnalysisProps {
  news: NewsArticle[];
}

const NewsAnalysis: React.FC<NewsAnalysisProps> = ({ news }) => {
  // Function to get impact details (label, color, icon)
  const getImpactDetails = (impact: string) => {
    switch (impact) {
      case 'high-positive':
        return {
          label: 'High Positive Impact',
          color: 'bg-green-100 text-green-800',
          icon: <ArrowUp className="w-4 h-4 text-green-500" />,
        };
      case 'positive':
        return {
          label: 'Positive Impact',
          color: 'bg-green-50 text-green-700',
          icon: <ArrowUp className="w-4 h-4 text-green-400" />,
        };
      case 'neutral':
        return {
          label: 'Neutral Impact',
          color: 'bg-gray-100 text-gray-800',
          icon: <Minus className="w-4 h-4 text-gray-500" />,
        };
      case 'negative':
        return {
          label: 'Negative Impact',
          color: 'bg-red-50 text-red-700',
          icon: <ArrowDown className="w-4 h-4 text-red-400" />,
        };
      case 'high-negative':
        return {
          label: 'High Negative Impact',
          color: 'bg-red-100 text-red-800',
          icon: <ArrowDown className="w-4 h-4 text-red-500" />,
        };
      default:
        return {
          label: 'Neutral Impact',
          color: 'bg-gray-100 text-gray-800',
          icon: <Minus className="w-4 h-4 text-gray-500" />,
        };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Market News</h2>
      <div className="space-y-4">
        {news.map((article, index) => {
          const impactDetails = getImpactDetails(article.impact);

          return (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {article.headline}
                </h3>
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{article.summary}</p>
              <div className="flex items-center mt-2">
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.headline}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{article.source}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(article.datetime * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center space-x-1 ${impactDetails.color}`}
                  >
                    {impactDetails.icon}
                    <span>{impactDetails.label}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsAnalysis;
