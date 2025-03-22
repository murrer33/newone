import React, { useState } from 'react';
import { TrendingUp, Search, ArrowUpDown, RefreshCw } from 'lucide-react';
import { useStocks } from '../context/StockContext';
import StockCard from '../components/StockCard';
import MarketStatusHeader from '../components/MarketStatusHeader';
import DataLoadingPlaceholder from '../components/DataLoadingPlaceholder';
import { useStockPageData } from '../hooks/useStockPageData';

const TrendingStocks: React.FC = () => {
  const { nasdaqStocks, bistStocks } = useStocks();
  const { 
    loading, 
    error, 
    marketStatus,
    lastUpdated,
    handleRefresh
  } = useStockPageData();
  
  const allStocks = [...nasdaqStocks, ...bistStocks];
  const [searchTerm, setSearchTerm] = useState('');

  const trendingStocks = [...allStocks]
    .sort((a, b) => Math.abs(b.price - a.price)) // Sort by price difference
    .filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const gainers = trendingStocks.slice(0, Math.ceil(trendingStocks.length / 2)); // Top half
  const losers = trendingStocks.slice(Math.ceil(trendingStocks.length / 2));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MarketStatusHeader
        title="Trending Stocks"
        loading={loading}
        error={error}
        marketStatus={marketStatus}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
      />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search trending stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {loading && (
            <div className="text-center text-sm text-gray-500 flex items-center">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> 
              Refreshing stock data...
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <ArrowUpDown className="h-5 w-5 text-green-500 mr-2" />
          Top Gainers
          <span className="text-sm ml-2 font-normal text-gray-500">
            ({marketStatus.isOpen ? 'Real-time prices' : 'Last closing prices'})
          </span>
        </h2>
        <DataLoadingPlaceholder
          isLoading={loading && gainers.length === 0}
          isEmpty={gainers.length === 0 && !loading}
          loadingMessage="Loading top gainers..."
          emptyMessage="No gainers found matching your search"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gainers.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} marketStatus={marketStatus} />
            ))}
          </div>
        </DataLoadingPlaceholder>
      </div>
      
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <ArrowUpDown className="h-5 w-5 text-red-500 mr-2 transform rotate-180" />
          Top Losers
          <span className="text-sm ml-2 font-normal text-gray-500">
            ({marketStatus.isOpen ? 'Real-time prices' : 'Last closing prices'})
          </span>
        </h2>
        <DataLoadingPlaceholder
          isLoading={loading && losers.length === 0}
          isEmpty={losers.length === 0 && !loading}
          loadingMessage="Loading top losers..."
          emptyMessage="No losers found matching your search"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {losers.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} marketStatus={marketStatus} />
            ))}
          </div>
        </DataLoadingPlaceholder>
      </div>
    </div>
  );
};

export default TrendingStocks;
