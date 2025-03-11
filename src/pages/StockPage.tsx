import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useStocks } from '../context/StockContext';
import LivePriceDisplay from '../components/LivePriceDisplay';
import StockStats from '../components/StockStats';
import StockChart from '../components/StockChart';
import TechnicalIndicator from '../components/TechnicalIndicator';
import NewsAnalysis from '../components/NewsAnalysis';
import SentimentAnalysisCard from '../components/SentimentAnalysisCard';
import PredictionChart from '../components/PredictionChart';
import KeyStatistics from '../components/KeyStatistics';
import CompanyProfile from '../components/CompanyProfile';
import {
  generateHistoricalData,
  generateTechnicalIndicators,
  generateStockPredictions,
  generateSocialSentiment,
  generateStockNews,
} from '../utils/mockData';

const StockPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { nasdaqStocks, bistStocks, loading, error } = useStocks();
  const allStocks = [...nasdaqStocks, ...bistStocks];
  const [timeframe, setTimeframe] = React.useState<'1D' | '5D' | '1W' | '1M' | '6M' | '1Y' | '5Y' | 'MAX'>('1D');

  if (!symbol) return <div>Stock symbol not provided</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const stock = allStocks.find((s) => s.symbol === symbol.toUpperCase());
  if (!stock) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
          <div className="text-red-500 text-6xl mb-4">404</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Stock Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            We couldn't find any stock with the symbol "{symbol}".
          </p>
          <Link
            to="/market"
            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Market Overview
          </Link>
        </div>
      </div>
    );
  }

  // Mock data for other components (since live data only has price)
  const historicalData = generateHistoricalData(symbol, 30);
  const technicalIndicators = generateTechnicalIndicators(symbol);
  const predictions = generateStockPredictions(symbol);
  const sentimentData = generateSocialSentiment(symbol);
  const newsData = generateStockNews(symbol);
  const mockStats = {
    marketCap: 2.5e12, // Example values
    volume: 85e6,
    avgVolume: 80e6,
    peRatio: 25.6,
    eps: 4.85,
    dividend: 1.75,
    high52w: stock.price * 1.2,
    low52w: stock.price * 0.8,
  };
  const mockKeyStats = { /* Same as original */ };
  const mockCompanyProfile = { /* Same as original */ };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link
          to="/market"
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Market Overview
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol}</h1>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{stock.name}</span>
            </div>
            <LivePriceDisplay
              price={stock.price}
              change={0} // No change data yet
              changePercent={0}
              lastUpdate={new Date().toISOString()}
            />
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
      <div className="mb-6">
        <StockStats stats={mockStats} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StockChart data={historicalData} timeframe={timeframe} onTimeframeChange={setTimeframe} />
          <KeyStatistics stats={mockKeyStats} />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technical Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicalIndicators.map((indicator, index) => (
                <TechnicalIndicator key={index} indicator={indicator} />
              ))}
            </div>
          </div>
          <NewsAnalysis news={newsData} />
          <CompanyProfile profile={mockCompanyProfile} />
        </div>
        <div className="space-y-6">
          <SentimentAnalysisCard data={sentimentData} />
          <PredictionChart historicalData={historicalData} predictions={predictions} />
        </div>
      </div>
    </div>
  );
};

export default StockPage;
