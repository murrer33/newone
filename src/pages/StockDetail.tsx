import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Activity, 
  Clock, 
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import StockChart from '../components/StockChart';
import TechnicalIndicator from '../components/TechnicalIndicator';
import PredictionCard from '../components/PredictionCard';
import SentimentAnalysisCard from '../components/SentimentAnalysisCard';
import NewsAnalysis from '../components/NewsAnalysis';
import PredictionChart from '../components/PredictionChart';
import { 
  getStockBySymbol, 
  generateHistoricalData, 
  generateTechnicalIndicators, 
  generateStockPredictions,
  generateSocialSentiment,
  generateStockNews
} from '../utils/mockData';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [timeframe, setTimeframe] = React.useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
  
  if (!symbol) {
    return <div>Stock symbol not provided</div>;
  }
  
  const stock = getStockBySymbol(symbol);
  
  if (!stock) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Stock Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400">
            We couldn't find any stock with the symbol "{symbol}".
          </p>
        </div>
      </div>
    );
  }
  
  const historicalData = generateHistoricalData(symbol, 30);
  const technicalIndicators = generateTechnicalIndicators(symbol);
  const predictions = generateStockPredictions(symbol);
  const sentimentData = generateSocialSentiment(symbol);
  const newsData = generateStockNews(symbol);
  
  const isPositive = stock.change >= 0;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stock Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{stock.symbol}</h1>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{stock.name}</span>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white mr-3">
                ${stock.price.toFixed(2)}
              </span>
              <span className={`flex items-center text-lg ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
                {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Market Cap', value: `$${(stock.marketCap / 1000000000).toFixed(2)}B`, icon: <DollarSign className="h-5 w-5" /> },
          { label: 'Volume', value: `${(stock.volume / 1000000).toFixed(2)}M`, icon: <Activity className="h-5 w-5" /> },
          { label: '52W High', value: `$${(stock.price * 1.2).toFixed(2)}`, icon: <TrendingUp className="h-5 w-5" /> },
          { label: '52W Low', value: `$${(stock.price * 0.8).toFixed(2)}`, icon: <TrendingDown className="h-5 w-5" /> }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                {stat.icon}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <StockChart data={historicalData} timeframe={timeframe} />
          
          {/* Prediction Chart */}
          <PredictionChart historicalData={historicalData} predictions={predictions} />
          
          {/* Technical Analysis */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
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
          <NewsAnalysis news={newsData} />
        </div>
        
        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Social Media Sentiment */}
          <SentimentAnalysisCard data={sentimentData} />
          
          {/* Predictions */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              Price Predictions
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {predictions.map((prediction, index) => (
                <PredictionCard key={index} prediction={prediction} />
              ))}
            </div>
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-sm text-yellow-700 dark:text-yellow-500">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Predictions are based on technical analysis and social media sentiment. They should not be considered as financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;