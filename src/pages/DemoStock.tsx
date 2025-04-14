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
  Moon,
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
    symbol: 'FPULSE',
    name: 'FinPulses',
    price: 150.25,
    change: 2.5,
    changePercent: 1.69,
    volume: 1250000,
    avgVolume: 1200000,
    marketCap: 2500000000,
    peRatio: 28.5,
    eps: 5.25,
    dividend: 1.2,
    fiftyTwoWeekHigh: 175.50,
    fiftyTwoWeekLow: 120.75,
    ask: 150.30,
    bid: 150.20,
    askSize: 500,
    bidSize: 750
  };

  // Generate mock data
  const historicalData = generateHistoricalData('AAPL', 30);
  const technicalIndicators = generateTechnicalIndicators('AAPL');
  const predictions: { date: string; price: number }[] = [
    { date: '2024-03-01', price: 152.50 },
    { date: '2024-03-02', price: 153.75 },
    { date: '2024-03-03', price: 155.00 },
    { date: '2024-03-04', price: 154.25 },
    { date: '2024-03-05', price: 156.50 }
  ];
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
  const PlanSelector = () => {
    const planFeatures = {
      free: [
        'Basic stock data',
        'Daily price updates',
        'Limited historical charts',
        'Basic news feed'
      ],
      plus: [
        'Everything in Free',
        'Technical indicators',
        'Stock comparison tool',
        'Advanced charting',
        'Extended historical data'
      ],
      pro: [
        'Everything in Plus',
        'AI-powered predictions',
        'Sentiment analysis',
        'Advanced screening tools',
        'Portfolio optimization',
        'Priority support'
      ]
    };

    const planPrices = {
      free: 'Free',
      plus: '$9.99/mo',
      pro: '$29.99/mo'
    };

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['free', 'plus', 'pro'] as Plan[]).map((plan) => (
            <div
              key={plan}
              onClick={() => setSelectedPlan(plan)}
              className={`p-6 rounded-lg border-2 transition-colors ${
                selectedPlan === plan
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              } cursor-pointer`}
            >
              <h3 className="text-xl font-semibold capitalize mb-2">{plan} Plan</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{planPrices[plan]}</p>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                <ul className="space-y-2">
                  {planFeatures[plan].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={`mt-6 w-full py-2 px-4 rounded-md text-center text-sm font-medium ${
                  selectedPlan === plan
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                } transition-colors`}
              >
                {selectedPlan === plan ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Feature lock overlay
  const FeatureLock = ({ feature }: { feature: string }) => {
    const requiredPlan = feature === 'technicalAnalysis' ? 'plus' : 'pro';
    
    return (
      <div className="absolute inset-0 bg-gray-900/60 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg max-w-xs mx-auto">
          <Lock className="h-10 w-10 text-blue-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Premium Feature</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            This feature requires the {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} plan or higher
          </p>
          <button 
            onClick={() => setSelectedPlan(requiredPlan)}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
          </button>
        </div>
      </div>
    );
  };

  // Add AskBid component
  const AskBid: React.FC<{ ask: number; bid: number; askSize: number; bidSize: number }> = ({ ask, bid, askSize, bidSize }) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Ask & Bid</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Ask</div>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">${ask.toFixed(2)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Size: {askSize}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Bid</div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">${bid.toFixed(2)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Size: {bidSize}</div>
          </div>
        </div>
      </div>
    );
  };

  // Add PredictionChart component
  const PredictionChart: React.FC<{ predictions: { date: string; price: number }[] }> = ({ predictions }) => {
    const chartData = {
      labels: predictions.map(p => p.date),
      datasets: [
        {
          label: 'Predicted Price',
          data: predictions.map(p => p.price),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Price Prediction</h3>
        <Line data={chartData} options={options} />
      </div>
    );
  };

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

        {/* Demo Banner */}
        <div className="bg-blue-500 text-white py-2 px-4 rounded-md mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            <span className="font-medium">Demo Mode: Experience our platform's features</span>
          </div>
          <a 
            href="/waitlist" 
            className="text-xs bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-md transition-colors ml-2"
          >
            Join Waitlist
          </a>
        </div>

        {/* Plans Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Experience FinPulses.tech</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Select a plan below to see how different features are unlocked. This demo gives you a preview of our powerful stock analysis platform.
          </p>
        </div>

        {/* Plan Selector */}
        <PlanSelector />

        {/* Features explanation */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features Included In Each Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Basic Stock Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                View real-time stock prices, basic charts, and company information.
              </p>
              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded">
                Available in Free
              </span>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Technical Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Access advanced technical indicators and pattern recognition tools.
              </p>
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">
                Requires Plus Plan
              </span>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Stock Comparison
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Compare multiple stocks side by side with custom metrics.
              </p>
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">
                Requires Plus Plan
              </span>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Advanced Charts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Access extended timeframes and advanced chart tools and annotations.
              </p>
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">
                Requires Plus Plan
              </span>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Sentiment Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Analyze social media sentiment and market opinions in real-time.
              </p>
              <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 px-2 py-1 rounded">
                Requires Pro Plan
              </span>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                AI Predictions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Get AI-powered price predictions and trading recommendations.
              </p>
              <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 px-2 py-1 rounded">
                Requires Pro Plan
              </span>
            </div>
          </div>
        </div>

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
          <StockStats
            stats={{
              marketCap: mockStockData.marketCap,
              volume: mockStockData.volume,
              avgVolume: mockStockData.avgVolume,
              peRatio: mockStockData.peRatio,
              eps: mockStockData.eps,
              dividend: mockStockData.dividend,
              high52w: mockStockData.fiftyTwoWeekHigh,
              low52w: mockStockData.fiftyTwoWeekLow,
            }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AskBid 
              ask={mockStockData.ask}
              bid={mockStockData.bid}
              askSize={mockStockData.askSize}
              bidSize={mockStockData.bidSize}
            />
            <PredictionChart predictions={predictions} />
          </div>
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

export default DemoStock; 