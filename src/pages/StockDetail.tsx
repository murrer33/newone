import React from 'react';
import { useParams } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { useStocks } from '../context/StockContext';
import StockChart from '../components/StockChart';
import TechnicalIndicator from '../components/TechnicalIndicator';
import PredictionCard from '../components/PredictionCard';
import SentimentAnalysisCard from '../components/SentimentAnalysisCard';
import NewsAnalysis from '../components/NewsAnalysis';
import PredictionChart from '../components/PredictionChart';
import MarketStatusHeader from '../components/MarketStatusHeader';
import DataLoadingPlaceholder from '../components/DataLoadingPlaceholder';
import { useStockPageData } from '../hooks/useStockPageData';
import {
  generateHistoricalData,
  generateTechnicalIndicators,
  generateStockPredictions,
  generateSocialSentiment,
  generateStockNews,
} from '../utils/mockData';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { nasdaqStocks, bistStocks } = useStocks();
  const { 
    loading, 
    error, 
    marketStatus,
    lastUpdated,
    handleRefresh,
    getPriceTypeMessage
  } = useStockPageData();
  
  const allStocks = [...nasdaqStocks, ...bistStocks];
  const [timeframe, setTimeframe] = React.useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');

  if (!symbol) return <div>Stock symbol not provided</div>;

  const stock = allStocks.find((s) => s.symbol === symbol.toUpperCase());
  const stockNotFound = !loading && !stock;
  
  // Generate data even if stock is not found, to avoid errors
  const historicalData = symbol ? generateHistoricalData(symbol, 30) : [];
  const technicalIndicators = symbol ? generateTechnicalIndicators(symbol) : [];
  const predictions = symbol ? generateStockPredictions(symbol) : [];
  const sentimentData = symbol ? generateSocialSentiment(symbol) : null;
  const newsData = symbol ? generateStockNews(symbol) : [];

  if (stockNotFound) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {symbol && (
        <MarketStatusHeader
          title={`${symbol.toUpperCase()} - ${stock?.name || 'Loading...'}`}
          loading={loading}
          error={error}
          marketStatus={marketStatus}
          lastUpdated={lastUpdated}
          onRefresh={handleRefresh}
        />
      )}

      <DataLoadingPlaceholder
        isLoading={loading && !stock}
        isEmpty={false}
        loadingMessage="Loading stock details..."
      >
        {stock && (
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
                  <span className="text-sm text-gray-500">
                    {getPriceTypeMessage()}
                    {loading && <span className="ml-1 inline-flex items-center">(Refreshing <RefreshCw className="ml-1 h-3 w-3 animate-spin" />)</span>}
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
        )}
      </DataLoadingPlaceholder>

      <DataLoadingPlaceholder
        isLoading={loading && !stock}
        isEmpty={false}
        loadingMessage="Loading stock metrics..."
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stock && [
            { label: 'Market Cap', value: '$2.5T', icon: <DollarSign className="h-5 w-5" /> },
            { label: 'Volume', value: '85M', icon: <Activity className="h-5 w-5" /> },
            { label: '52W High', value: `$${(stock.price * 1.2).toFixed(2)}`, icon: <TrendingUp className="h-5 w-5" /> },
            { label: '52W Low', value: `$${(stock.price * 0.8).toFixed(2)}`, icon: <TrendingDown className="h-5 w-5" /> },
          ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 text-blue-500">{stat.icon}</div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DataLoadingPlaceholder>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DataLoadingPlaceholder
            isLoading={loading && historicalData.length === 0}
            isEmpty={historicalData.length === 0}
            loadingMessage="Loading chart data..."
            emptyMessage="No historical data available"
          >
            <StockChart data={historicalData} timeframe={timeframe} />
            <PredictionChart historicalData={historicalData} predictions={predictions} />
          </DataLoadingPlaceholder>
          
          <DataLoadingPlaceholder
            isLoading={loading && technicalIndicators.length === 0}
            isEmpty={technicalIndicators.length === 0}
            loadingMessage="Loading technical indicators..."
            emptyMessage="No technical indicators available"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                Technical Analysis
                <span className="text-sm ml-2 font-normal text-gray-500">
                  ({marketStatus.isOpen ? 'Real-time analysis' : 'Based on last closing data'})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {technicalIndicators.map((indicator, index) => (
                  <TechnicalIndicator key={index} indicator={indicator} />
                ))}
              </div>
            </div>
          </DataLoadingPlaceholder>
          
          <DataLoadingPlaceholder
            isLoading={loading && newsData.length === 0}
            isEmpty={newsData.length === 0}
            loadingMessage="Loading news..."
            emptyMessage="No news available"
          >
            <NewsAnalysis news={newsData} />
          </DataLoadingPlaceholder>
        </div>
        
        <div className="space-y-6">
          <DataLoadingPlaceholder
            isLoading={loading && !sentimentData}
            isEmpty={!sentimentData}
            loadingMessage="Loading sentiment data..."
            emptyMessage="No sentiment data available"
          >
            {sentimentData && <SentimentAnalysisCard data={sentimentData} />}
          </DataLoadingPlaceholder>
          
          <DataLoadingPlaceholder
            isLoading={loading && predictions.length === 0}
            isEmpty={predictions.length === 0}
            loadingMessage="Loading predictions..."
            emptyMessage="No predictions available"
          >
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
                  Predictions are based on technical analysis and social media sentiment.
                </p>
              </div>
            </div>
          </DataLoadingPlaceholder>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
