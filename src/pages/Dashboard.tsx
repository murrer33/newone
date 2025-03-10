import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, MessageSquare } from 'lucide-react';
import MarketOverview from '../components/MarketOverview';
import NewsAnalysis from '../components/NewsAnalysis';
import { useLivePrice } from '../hooks/useLivePrice'; // For real-time prices

// Mock data (replace with real data or API calls)
const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 150.25, changePercent: 1.5 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2800.50, changePercent: -0.75 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 750.00, changePercent: 3.2 },
];

const generateMarketNews = () => [
  { title: 'Market Rally Continues', content: 'Stocks rise as investors remain optimistic.' },
  { title: 'Tech Stocks Surge', content: 'Tech giants lead the market gains.' },
];

const Dashboard: React.FC = () => {
  // Real-time price for AAPL
  const { price: aaplPrice } = useLivePrice('AAPL', 150);

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

  // Top gainers and losers
  const topGainers = [...popularStocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const topLosers = [...popularStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);

  // Market news
  const marketNews = generateMarketNews();

  // Social media sentiment summary
  const sentimentSummary = {
    positive: 42,
    negative: 28,
    neutral: 30,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Market Dashboard</h1>

      {/* Real-Time AAPL Price */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Real-Time AAPL Price</h2>
        <p className="text-3xl font-semibold text-gray-900 dark:text-white">${aaplPrice.toFixed(2)}</p>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <MarketOverview stocks={popularStocks} />

      {/* Market News with Analysis */}
      <div className="mt-8">
        <NewsAnalysis news={marketNews} />
      </div>
    </div>
  );
};

export default Dashboard;
