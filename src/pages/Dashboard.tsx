import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, MessageSquare } from 'lucide-react';
import MarketOverview from '../components/MarketOverview';
import NewsAnalysis from '../components/NewsAnalysis';
import MarketStatus from '../components/MarketStatus';
import { useStocks } from '../context/StockContext'; // Import the useStocks hook
import { useNews } from '../hooks/useNews'; // For real news

const Dashboard: React.FC = () => {
  // Use the global stock context
  const { nasdaqStocks, bistStocks, loading: stocksLoading, error: stocksError, marketStatus } = useStocks();

  // Fetch real news data
  const { news, loading: newsLoading, error: newsError } = useNews('AAPL');

  // Market summary stats
  const marketStats = [
    {
      name: 'S&P 500',
      value: '4,927.11',
      change: '+0.41%',
      isPositive: true,
      icon: <BarChart3 className="h-6 w-6" />,
    },
    {
      name: 'Dow Jones',
      value: '38,239.98',
      change: '+0.56%',
      isPositive: true,
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      name: 'Nasdaq',
      value: '15,927.90',
      change: '-0.27%',
      isPositive: false,
      icon: <TrendingDown className="h-6 w-6" />,
    },
    {
      name: 'Bitcoin',
      value: '$63,245.78',
      change: '+2.14%',
      isPositive: true,
      icon: <DollarSign className="h-6 w-6" />,
    },
  ];

  // Top gainers and losers (updated with real-time prices)
  const topGainers = nasdaqStocks
    .map((stock) => ({
      ...stock,
      changePercent: ((stock.price - 100) / 100) * 100, // Example calculation for changePercent
    }))
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 2); // Top 2 gainers

  const topLosers = nasdaqStocks
    .map((stock) => ({
      ...stock,
      changePercent: ((stock.price - 100) / 100) * 100, // Example calculation for changePercent
    }))
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 1); // Top 1 loser

  // Social media sentiment summary
  const sentimentSummary = {
    positive: 42,
    negative: 28,
    neutral: 30,
  };

  if (stocksLoading) return <p>Loading stock data...</p>;
  if (stocksError) return <p>{stocksError}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Market Dashboard</h1>

      {/* Market Status */}
      <div className="mb-8">
        <MarketStatus 
          isOpen={marketStatus.isOpen} 
          holiday={marketStatus.holiday} 
        />
      </div>

      {/* Real-Time Prices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {nasdaqStocks.slice(0, 3).map((stock) => (
          <div key={stock.symbol} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{stock.symbol} Price</h2>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {marketStatus.isOpen ? 'Real-time price' : 'Last closing price'}
            </p>
          </div>
        ))}
      </div>

      {/* Market Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {marketStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.isPositive ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                <p className={`text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Social Media Sentiment Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Market Sentiment</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Overall market sentiment based on social media analysis</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Positive: {sentimentSummary.positive}%</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Negative: {sentimentSummary.negative}%</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Neutral: {sentimentSummary.neutral}%</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div 
                  className="bg-green-500 h-full" 
                  style={{ width: `${sentimentSummary.positive}%` }}
                ></div>
                <div 
                  className="bg-gray-400 h-full" 
                  style={{ width: `${sentimentSummary.neutral}%` }}
                ></div>
                <div 
                  className="bg-red-500 h-full" 
                  style={{ width: `${sentimentSummary.negative}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Trending topics: #earnings #inflation #tech #growth</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Gainers</h2>
          </div>
          <div className="space-y-4">
            {topGainers.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{stock.symbol}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">${stock.price.toFixed(2)}</p>
                  <p className="text-sm text-green-500">+{stock.changePercent.toFixed(2)}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {marketStatus.isOpen ? 'Real-time' : 'Last close'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Losers</h2>
          </div>
          <div className="space-y-4">
            {topLosers.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{stock.symbol}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">${stock.price.toFixed(2)}</p>
                  <p className="text-sm text-red-500">{stock.changePercent.toFixed(2)}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {marketStatus.isOpen ? 'Real-time' : 'Last close'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <MarketOverview stocks={nasdaqStocks} />

      {/* Market News with Analysis */}
      <div className="mt-8">
        {newsLoading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading news...</p>
        ) : newsError ? (
          <p className="text-center text-red-500 dark:text-red-400">{newsError}</p>
        ) : (
          <NewsAnalysis news={news as any} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
