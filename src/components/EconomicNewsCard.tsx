import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  AlertTriangle, 
  Info, 
  Globe, 
  Briefcase 
} from 'lucide-react';
import { EconomicNewsItem } from '../hooks/useEconomicNews';

interface EconomicNewsCardProps {
  news: EconomicNewsItem;
}

const EconomicNewsCard: React.FC<EconomicNewsCardProps> = ({ news }) => {
  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get color based on sentiment
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Get icon based on sentiment
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get color based on impact level
  const getImpactColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-orange-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      {/* News Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {news.headline}
        </h3>
        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(news.datetime)}</span>
          <span className="mx-2">•</span>
          <span>{news.source}</span>
        </div>
      </div>
      
      {/* News Image if available */}
      {news.image && (
        <div className="relative h-40 overflow-hidden">
          <img 
            src={news.image} 
            alt={news.headline} 
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>
      )}
      
      {/* News Summary */}
      <div className="p-4 flex-grow">
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          {news.summary.length > 200 
            ? `${news.summary.slice(0, 200)}...` 
            : news.summary}
        </p>
      </div>
      
      {/* Market Impact Analysis */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="mb-2">
          <div className="flex items-center">
            <div className={`mr-2 ${getSentimentColor(news.sentiment)}`}>
              {getSentimentIcon(news.sentiment)}
            </div>
            <div className="text-sm font-medium capitalize">
              <span className={getSentimentColor(news.sentiment)}>
                {news.sentiment} Sentiment
              </span>
              <span className="mx-2">•</span>
              <span className={getImpactColor(news.impactLevel)}>
                {news.impactLevel.charAt(0).toUpperCase() + news.impactLevel.slice(1)} Impact
              </span>
            </div>
          </div>
        </div>
        
        {/* Market-wide Alert */}
        {news.isMarketWide && (
          <div className="flex items-start mb-2 border-l-4 border-amber-500 pl-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-sm">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-200">
              This event could affect the entire market.
            </p>
          </div>
        )}
        
        {/* Affected Sectors */}
        {news.affectedSectors.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center text-xs text-gray-700 dark:text-gray-300">
              <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
              <span className="font-medium">Affected Sectors:</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {news.affectedSectors.map((sector, idx) => (
                <span 
                  key={idx} 
                  className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded"
                >
                  {sector.charAt(0).toUpperCase() + sector.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Mentioned Stocks */}
        {news.mentionedSymbols.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center text-xs text-gray-700 dark:text-gray-300">
              <Globe className="h-4 w-4 mr-1 text-gray-500" />
              <span className="font-medium">Mentioned Stocks:</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {news.mentionedSymbols.map((symbol, idx) => (
                <Link 
                  key={idx} 
                  to={`/stock/${symbol}`}
                  className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800/30 transition-colors"
                >
                  {symbol}
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Your Portfolio Alert */}
        {news.portfolioMentioned.length > 0 && (
          <div className="flex items-start border-l-4 border-purple-500 pl-2 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-sm">
            <Info className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-purple-800 dark:text-purple-200">
              <p className="font-medium">Your portfolio may be affected:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {news.portfolioMentioned.map((symbol, idx) => (
                  <Link 
                    key={idx} 
                    to={`/stock/${symbol}`}
                    className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors"
                  >
                    {symbol}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Read More Link */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <a 
          href={news.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors text-sm"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Read Full Article
        </a>
      </div>
    </div>
  );
};

export default EconomicNewsCard; 