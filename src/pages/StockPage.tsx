// StockPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom'; // Ensure useParams is imported
import { ChevronLeft, RefreshCw } from 'lucide-react';
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

const StockPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>(); // useParams should now work
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
  const [timeframe, setTimeframe] = React.useState<'1D' | '5D' | '1W' | '1M' | '6M' | '1Y' | '5Y' | 'MAX'>('1D');

  if (!symbol) return <div>Stock symbol not provided</div>;

  const stock = allStocks.find((s) => s.symbol === symbol.toUpperCase());
  const stockNotFound = !loading && !stock;
  
  // Generate data even if stock is not found, to avoid errors
  const historicalData = symbol ? generateHistoricalData(symbol, 30) : [];
  const technicalIndicators = symbol ? generateTechnicalIndicators(symbol) : [];
  const predictions = symbol ? generateStockPredictions(symbol) : [];
  const sentimentData = symbol ? generateSocialSentiment(symbol) : null;
  const newsData = symbol ? generateStockNews(symbol) : [];

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

  // Mock data for other components (since live data only has price)
  const mockStats = stock ? {
    marketCap: 2.5e12, // Example values
    volume: 85e6,
    avgVolume: 80e6,
    peRatio: 25.6,
    eps: 4.85,
    dividend: 1.75,
    high52w: stock.price * 1.2,
    low52w: stock.price * 0.8,
  } : null;
  
  const mockKeyStats = stock ? {
    marketCap: 2.5e12,
    enterpriseValue: 2.6e12,
    trailingPE: 25.6,
    forwardPE: 22.4,
    pegRatio: 1.8,
    priceToSales: 7.2,
    priceToBook: 35.5,
    enterpriseToRevenue: 7.5,
    enterpriseToEbitda: 18.9,
    beta: 1.2,
    fiftyTwoWeekChange: 15.3,
    fiftyTwoWeekHigh: stock.price * 1.2,
    fiftyTwoWeekLow: stock.price * 0.8,
    fiftyDayAverage: stock.price * 1.05,
    twoHundredDayAverage: stock.price * 1.02,
    sharesOutstanding: 15.8e9,
    sharesFloat: 15.7e9,
    sharesShort: 120e6,
    shortRatio: 2.3,
    shortPercentOfFloat: 0.76,
    averageVolume: 80e6,
    volume: 85e6,
    dividendRate: 0.88,
    dividendYield: 0.5,
    exDividendDate: '2023-08-10',
    payoutRatio: 14.5,
  } : null;
  
  const mockCompanyProfile = stock ? {
    description: `${stock.name} is a leading company in its industry.`,
    sector: 'Technology',
    industry: 'Software',
    employees: 147000,
    founded: 1976,
    headquarters: 'Cupertino, CA, USA',
    website: 'https://www.example.com',
    phone: '+1-800-555-1234',
    email: 'contact@example.com',
    executives: [
      { name: 'John Doe', title: 'CEO', age: 55, since: 2011 },
      { name: 'Jane Smith', title: 'CFO', age: 48, since: 2015 },
    ],
  } : null;

  if (stockNotFound) {
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
      
      <div className="mb-4">
        <Link
          to="/market"
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Market Overview
        </Link>
      </div>
      
      <DataLoadingPlaceholder
        isLoading={loading && !stock}
        isEmpty={false}
        loadingMessage="Loading stock details..."
      >
        {stock && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol}</h1>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{stock.name}</span>
                </div>
                <div className="flex items-center">
                  <LivePriceDisplay
                    price={stock.price}
                    change={0} // No change data yet
                    changePercent={0}
                    lastUpdate={new Date().toISOString()}
                  />
                  <span className="ml-2 text-sm text-gray-500">
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
        isLoading={loading && !mockStats}
        isEmpty={!mockStats}
        loadingMessage="Loading stock statistics..."
      >
        {mockStats && (
          <div className="mb-6">
            <StockStats stats={mockStats} />
          </div>
        )}
      </DataLoadingPlaceholder>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DataLoadingPlaceholder
            isLoading={loading && historicalData.length === 0}
            isEmpty={historicalData.length === 0}
            loadingMessage="Loading chart data..."
          >
            <StockChart data={historicalData} timeframe={timeframe} onTimeframeChange={setTimeframe} />
          </DataLoadingPlaceholder>
          
          <DataLoadingPlaceholder
            isLoading={loading && !mockKeyStats}
            isEmpty={!mockKeyStats}
            loadingMessage="Loading key statistics..."
          >
            {mockKeyStats && <KeyStatistics stats={mockKeyStats} />}
          </DataLoadingPlaceholder>
          
          <DataLoadingPlaceholder
            isLoading={loading && technicalIndicators.length === 0}
            isEmpty={technicalIndicators.length === 0}
            loadingMessage="Loading technical indicators..."
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
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
          >
            <NewsAnalysis news={newsArticles} />
          </DataLoadingPlaceholder>
          
          <DataLoadingPlaceholder
            isLoading={loading && !mockCompanyProfile}
            isEmpty={!mockCompanyProfile}
            loadingMessage="Loading company profile..."
          >
            {mockCompanyProfile && <CompanyProfile profile={mockCompanyProfile} />}
          </DataLoadingPlaceholder>
        </div>
        
        <div className="space-y-6">
          <DataLoadingPlaceholder
            isLoading={loading && !sentimentData}
            isEmpty={!sentimentData}
            loadingMessage="Loading sentiment data..."
          >
            {sentimentData && <SentimentAnalysisCard data={sentimentData} />}
          </DataLoadingPlaceholder>
          
          <DataLoadingPlaceholder
            isLoading={loading && historicalData.length === 0}
            isEmpty={historicalData.length === 0 || predictions.length === 0}
            loadingMessage="Loading predictions..."
          >
            {historicalData.length > 0 && predictions.length > 0 && (
              <PredictionChart historicalData={historicalData} />
            )}
          </DataLoadingPlaceholder>
        </div>
      </div>
    </div>
  );
};

export default StockPage;
