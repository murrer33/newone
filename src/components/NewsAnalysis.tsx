import React from 'react';

interface NewsArticle {
  headline: string;
  summary: string;
  url: string;
  image?: string;
  source: string;
  datetime: number;
}

interface NewsAnalysisProps {
  news: NewsArticle[];
}

const NewsAnalysis: React.FC<NewsAnalysisProps> = ({ news }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Market News</h2>
      <div className="space-y-4">
        {news.map((article, index) => (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsAnalysis;
