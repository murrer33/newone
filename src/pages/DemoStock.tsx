import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Scale,
  Clock,
  Users,
  Search,
  Plus,
  X,
  Lock,
  Sun,
  Moon
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import MarketStatusHeader from '../components/MarketStatusHeader';
import StockStats from '../components/StockStats';
import TechnicalIndicator from '../components/TechnicalIndicator';
import NewsAnalysis from '../components/NewsAnalysis';
import SentimentAnalysisCard from '../components/SentimentAnalysisCard';
import DataLoadingPlaceholder from '../components/DataLoadingPlaceholder';
import {
  generateHistoricalData,
  generateTechnicalIndicators,
  generateStockPredictions,
  generateSocialSentiment,
  generateStockNews,
} from '../utils/mockData';
import { HistoricalData } from '../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Plan = 'free' | 'plus' | 'pro';
type Timeframe = '1D' | '5D' | '1W' | '1M' | '6M' | '1Y' | '5Y' | 'MAX';

const DemoStock: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [selectedStocks, setSelectedStocks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<Plan>('free');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock data for demonstration
  const mockStockData = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.34,
    change: 2.45,
    changePercent: 1.42,
    marketCap: 2.5e12,
    volume: 85e6,
    avgVolume: 80e6,
    peRatio: 25.6,
    eps: 4.85,
    dividend: 1.75,
    high52w: 198.23,
    low52w: 142.53,
  };

  // Generate mock data
  const historicalData = generateHistoricalData('AAPL', 30);
  const technicalIndicators = generateTechnicalIndicators('AAPL');
  const predictions = generateStockPredictions('AAPL');
  const sentimentData = generateSocialSentiment('AAPL');
  const newsData = generateStockNews('AAPL');

  // Convert NewsItem[] to NewsArticle[] format expected by NewsAnalysis component
  const newsArticles = newsData.map(item => {
    // Map impact to the correct type expected by NewsAnalysis component
    let newsImpact: 'high-positive' | 'positive' | 'neutral' | 'negative' | 'high-negative' = 'neutral';
    
    if (item.impact === 'high' && item.sentiment === 'positive') {
      newsImpact = 'high-positive';
    } else if (item.impact === 'medium' && item.sentiment === 'positive') {
      newsImpact = 'positive';
    } else if (item.impact === 'medium' && item.sentiment === 'negative') {
      newsImpact = 'negative';
    } else if (item.impact === 'high' && item.sentiment === 'negative') {
      newsImpact = 'high-negative';
    }
    
    return {
      headline: item.title,
      summary: item.title, // Use title as summary if content doesn't exist
      datetime: new Date(item.time).getTime(), // Convert time string to timestamp
      url: item.url,
      source: item.source,
      image: item.image,
      impact: newsImpact
    };
  });

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const chartData = {
    labels: historicalData.map(data => new Date(data.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Price',
        data: historicalData.map(data => data.close),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  // Feature availability based on plan
  const isFeatureAvailable = (feature: string) => {
    switch (feature) {
      case 'technicalAnalysis':
        return selectedPlan !== 'free';
      case 'sentimentAnalysis':
        return selectedPlan === 'pro';
      case 'stockComparison':
        return selectedPlan !== 'free';
      case 'advancedChart':
        return selectedPlan !== 'free';
      default:
        return true;
    }
  };

  // Plan selection component
  const PlanSelector = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['free', 'plus', 'pro'] as Plan[]).map((plan) => (
          <button
            key={plan}
            onClick={() => setSelectedPlan(plan)}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedPlan === plan
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <h3 className="text-lg font-semibold capitalize">{plan} Plan</h3>
          </button>
        ))}
      </div>
    </div>
  );

  // Feature lock overlay
  const FeatureLock = ({ feature }: { feature: string }) => (
    <div className="absolute inset-0 bg-gray-900/50 dark:bg-gray-900/70 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <Lock className="h-8 w-8 text-white mx-auto mb-2" />
        <p className="text-white text-sm">Upgrade to {feature === 'technicalAnalysis' ? 'Plus' : 'Pro'} plan</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Plan Selector */}
        <PlanSelector />

        {/* Market Status Header */}
        <MarketStatusHeader
          title="Demo Stock Page"
          loading={false}
          error={null}
          marketStatus={{
            isOpen: true,
            holiday: null,
            loading: false,
            error: null
          }}
          lastUpdated={new Date()}
          onRefresh={() => {}}
        />

        {/* Main Stock Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <div className="flex items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{mockStockData.symbol}</h1>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{mockStockData.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${mockStockData.price}
                </span>
                <span className={`ml-2 text-sm ${mockStockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mockStockData.change >= 0 ? '+' : ''}{mockStockData.change} ({mockStockData.changePercent}%)
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Buy
              </button>
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>

        {/* Stock Stats */}
        <div className="mb-6">
          <StockStats stats={{
            marketCap: mockStockData.marketCap,
            volume: mockStockData.volume,
            avgVolume: mockStockData.avgVolume,
            peRatio: mockStockData.peRatio,
            eps: mockStockData.eps,
            dividend: mockStockData.dividend,
            high52w: mockStockData.high52w,
            low52w: mockStockData.low52w,
          }} />
        </div>

        {/* Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
              {!isFeatureAvailable('advancedChart') && <FeatureLock feature="advancedChart" />}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Price Chart</h2>
                <div className="flex space-x-2">
                  {(['1D', '5D', '1W', '1M', '6M', '1Y', '5Y', 'MAX'] as Timeframe[]).map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeframe(period)}
                      className={`px-2 py-1 text-xs rounded ${
                        timeframe === period
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-80">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Technical Indicators */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
              {!isFeatureAvailable('technicalAnalysis') && <FeatureLock feature="technicalAnalysis" />}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                Technical Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {technicalIndicators.map((indicator, index) => (
                  <TechnicalIndicator key={index} indicator={indicator} />
                ))}
              </div>
            </div>

            {/* News Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">News Analysis</h2>
              <NewsAnalysis news={newsArticles} />
            </div>
          </div>

          <div className="space-y-6">
            {/* Sentiment Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
              {!isFeatureAvailable('sentimentAnalysis') && <FeatureLock feature="sentimentAnalysis" />}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sentiment Analysis</h2>
              {sentimentData && <SentimentAnalysisCard data={sentimentData} />}
            </div>

            {/* Stock Comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative">
              {!isFeatureAvailable('stockComparison') && <FeatureLock feature="stockComparison" />}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock Comparison</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search stocks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={() => setSearchTerm('')}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedStocks.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm dark:text-white">{stock.symbol}</span>
                      <button
                        onClick={() => setSelectedStocks(selectedStocks.filter(s => s.symbol !== stock.symbol))}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {selectedStocks.length < 4 && (
                  <button
                    className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Stock</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Market Status Header */}
      <MarketStatusHeader
        title="Demo Stock Page"
        loading={false}
        error={null}
        marketStatus={{
          isOpen: true,
          holiday: null,
          loading: false,
          error: null
        }}
        lastUpdated={new Date()}
        onRefresh={() => {}}
      />

      {/* Main Stock Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{mockStockData.symbol}</h1>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{mockStockData.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${mockStockData.price}
              </span>
              <span className={`ml-2 text-sm ${mockStockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {mockStockData.change >= 0 ? '+' : ''}{mockStockData.change} ({mockStockData.changePercent}%)
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Buy
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>

      {/* Stock Stats */}
      <div className="mb-6">
        <StockStats stats={{
          marketCap: mockStockData.marketCap,
          volume: mockStockData.volume,
          avgVolume: mockStockData.avgVolume,
          peRatio: mockStockData.peRatio,
          eps: mockStockData.eps,
          dividend: mockStockData.dividend,
          high52w: mockStockData.high52w,
          low52w: mockStockData.low52w,
        }} />
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Price Chart</h2>
              <div className="flex space-x-2">
                {(['1D', '5D', '1W', '1M', '6M', '1Y', '5Y', 'MAX'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-2 py-1 text-xs rounded ${
                      timeframe === period
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Technical Indicators */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
              Technical Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicalIndicators.map((indicator, index) => (
                <TechnicalIndicator key={index} indicator={indicator} />
              ))}
            </div>
          </div>

          {/* News Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">News Analysis</h2>
            <NewsAnalysis news={newsArticles} />
          </div>
        </div>

        <div className="space-y-6">
          {/* Sentiment Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sentiment Analysis</h2>
            {sentimentData && <SentimentAnalysisCard data={sentimentData} />}
          </div>

          {/* Stock Comparison */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock Comparison</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                {selectedStocks.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm">{stock.symbol}</span>
                    <button
                      onClick={() => setSelectedStocks(selectedStocks.filter(s => s.symbol !== stock.symbol))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              {selectedStocks.length < 4 && (
                <button
                  className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Stock</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoStock; 