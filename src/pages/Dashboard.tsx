import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, MessageSquare, Clock } from 'lucide-react';
import MarketOverview from '../components/MarketOverview';
import NewsAnalysis from '../components/NewsAnalysis';
import { useStocks } from '../context/StockContext'; // Import the useStocks hook
import { useNews } from '../hooks/useNews'; // For real news
import StockChart from '../components/StockChart';
import { HistoricalData } from '../types';

const Dashboard: React.FC = () => {
  // Use the global stock context
  const { nasdaqStocks, bistStocks, loading: stocksLoading, error: stocksError } = useStocks();

  // Fetch real news data
  const { news, loading: newsLoading, error: newsError } = useNews('AAPL');

  const [isMarketOpen, setIsMarketOpen] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');

  // Function to check if market is open
  const checkMarketStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Market is closed on weekends
    if (day === 0 || day === 6) {
      setIsMarketOpen(false);
      return;
    }

    // Market hours: 9:30 AM - 4:00 PM EST (Monday-Friday)
    const isMarketHours = (hour > 9 || (hour === 9 && minute >= 30)) && hour < 16;
    setIsMarketOpen(isMarketHours);
  };

  // Update market status and last update time
  useEffect(() => {
    checkMarketStatus();
    setLastUpdateTime(new Date().toLocaleTimeString());
    
    // Update every minute
    const interval = setInterval(() => {
      checkMarketStatus();
      setLastUpdateTime(new Date().toLocaleTimeString());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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

  // Sample data - replace with actual data from your API
  const sampleData: HistoricalData[] = [
    { date: '2024-01-01', open: 100, high: 105, low: 98, close: 102, volume: 1000000 },
    { date: '2024-01-02', open: 102, high: 108, low: 100, close: 105, volume: 1200000 },
    // Add more sample data as needed
  ];

  if (stocksLoading) return <p>Loading stock data...</p>;
  if (stocksError) return <p>{stocksError}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stock Dashboard</h1>
        <p className="text-gray-600 mt-2">Real-time stock analysis and technical indicators</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <StockChart data={sampleData} symbol="AAPL" />
        </div>

        {/* Sidebar with Additional Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Stock Information</h2>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Last updated: {lastUpdateTime}</span>
            </div>
          </div>
          
          {/* Market Status */}
          <div className="mb-4 p-3 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Market Status:</span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                isMarketOpen 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isMarketOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            {!isMarketOpen && (
              <p className="text-sm text-gray-500 mt-1">
                Showing last known prices from previous trading day
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Price</h3>
              <p className="text-2xl font-bold text-gray-900">$150.25</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Change</h3>
              <p className="text-lg font-semibold text-green-600">+2.5%</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Volume</h3>
              <p className="text-lg font-semibold text-gray-900">1.2M</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Market Cap</h3>
              <p className="text-lg font-semibold text-gray-900">$2.5T</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Technical Analysis Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Technical Analysis</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">RSI (14)</span>
              <span className="font-medium">65.4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">MACD</span>
              <span className="font-medium text-green-600">Bullish</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Moving Averages</span>
              <span className="font-medium text-green-600">Bullish</span>
            </div>
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Market Sentiment</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overall Sentiment</span>
              <span className="font-medium text-green-600">Positive</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Social Media</span>
              <span className="font-medium text-green-600">Bullish</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">News Sentiment</span>
              <span className="font-medium text-green-600">Positive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
