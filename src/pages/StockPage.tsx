import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getStockBySymbol } from '../utils/mockData';
import { useLivePrice } from '../hooks/useLivePrice';
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
  generateStockNews
} from '../utils/mockData';

const StockPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [timeframe, setTimeframe] = React.useState<'1D' | '5D' | '1W' | '1M' | '6M' | '1Y' | '5Y' | 'MAX'>('1D');
  
  if (!symbol) {
    return <div>Stock symbol not provided</div>;
  }
  
  const stock = getStockBySymbol(symbol);
  
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

  const { price, change, changePercent, priceHistory } = useLivePrice(stock.price);
  const historicalData = generateHistoricalData(symbol, 30);
  const technicalIndicators = generateTechnicalIndicators(symbol);
  const predictions = generateStockPredictions(symbol);
  const sentimentData = generateSocialSentiment(symbol);
  const newsData = generateStockNews(symbol);

  const mockStats = {
    marketCap: stock.marketCap,
    volume: stock.volume,
    avgVolume: stock.volume * 0.8,
    peRatio: 25.6,
    eps: 4.85,
    dividend: 1.75,
    high52w: stock.price * 1.2,
    low52w: stock.price * 0.8
  };

  const mockKeyStats = {
    marketCap: stock.marketCap,
    enterpriseValue: stock.marketCap * 1.1,
    trailingPE: 25.6,
    forwardPE: 22.4,
    pegRatio: 1.5,
    priceToSales: 6.8,
    priceToBook: 12.4,
    enterpriseToRevenue: 6.2,
    enterpriseToEbitda: 18.5,
    beta: 1.2,
    fiftyTwoWeekChange: 15.4,
    fiftyTwoWeekHigh: stock.price * 1.2,
    fiftyTwoWeekLow: stock.price * 0.8,
    fiftyDayAverage: stock.price * 1.05,
    twoHundredDayAverage: stock.price * 0.95,
    sharesOutstanding: 16.5e9,
    sharesFloat: 16.2e9,
    sharesShort: 0.2e9,
    shortRatio: 1.2,
    shortPercentOfFloat: 1.8,
    averageVolume: stock.volume * 0.8,
    volume: stock.volume,
    dividendRate: 0.92,
    dividendYield: 0.6,
    exDividendDate: '2024-02-09',
    payoutRatio: 15.2
  };

  const mockCompanyProfile = {
    description: `${stock.name} is a leading technology company that designs, develops, and sells consumer electronics, software, and services. The company's innovative product portfolio includes smartphones, computers, tablets, wearables, and accessories, along with a variety of services.`,
    sector: 'Technology',
    industry: 'Consumer Electronics',
    employees: 164000,
    founded: 1976,
    headquarters: 'Cupertino, California, United States',
    website: 'https://www.apple.com',
    phone: '+1 (408) 996-1010',
    email: 'investor_relations@apple.com',
    executives: [
      {
        name: 'Tim Cook',
        title: 'Chief Executive Officer',
        age: 63,
        since: 2011
      },
      {
        name: 'Luca Maestri',
        title: 'Chief Financial Officer',
        age: 59,
        since: 2014
      },
      {
        name: 'Jeff Williams',
        title: 'Chief Operating Officer',
        age: 61,
        since: 2015
      },
      {
        name: 'Katherine Adams',
        title: 'General Counsel',
        age: 57,
        since: 2017
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <div className="mb-4">
        <Link 
          to="/market" 
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Market Overview
        </Link>
      </div>

      {/* Stock Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol}</h1>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{stock.name}</span>
            </div>
            <LivePriceDisplay 
              price={price}
              change={change}
              changePercent={changePercent}
              lastUpdate={priceHistory[priceHistory.length - 1]?.timestamp}
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

      {/* Stock Stats */}
      <div className="mb-6">
        <StockStats stats={mockStats} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <StockChart 
            data={historicalData} 
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            realTimeData={timeframe === '1D' ? priceHistory : undefined}
          />
          
          <KeyStatistics stats={mockKeyStats} />
          
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Technical Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicalIndicators.map((indicator, index) => (
                <TechnicalIndicator key={index} indicator={indicator} />
              ))}
            </div>
          </div>

          <NewsAnalysis news={newsData} />
          
          <CompanyProfile profile={mockCompanyProfile} />
        </div>

        {/* Right Column - Sentiment and Predictions */}
        <div className="space-y-6">
          <SentimentAnalysisCard data={sentimentData} />
          <PredictionChart historicalData={historicalData} predictions={predictions} />
        </div>
      </div>
    </div>
  );
};

export default StockPage;