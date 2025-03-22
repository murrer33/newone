import React, { useState } from 'react';
import { Globe, Search, RefreshCw } from 'lucide-react';
import { useStocks } from '../context/StockContext';
import StockCard from '../components/StockCard';
import MarketStatusHeader from '../components/MarketStatusHeader';
import DataLoadingPlaceholder from '../components/DataLoadingPlaceholder';
import { useStockPageData } from '../hooks/useStockPageData';

const PopularStocks: React.FC = () => {
  const { nasdaqStocks } = useStocks(); // Assuming popular = NASDAQ
  const { 
    loading, 
    error, 
    marketStatus,
    lastUpdated,
    handleRefresh
  } = useStockPageData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'symbol' | 'price'>('symbol');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: 'symbol' | 'price') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredStocks = nasdaqStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (sortBy === 'symbol') {
      return sortDirection === 'asc'
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    } else {
      return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MarketStatusHeader
        title="Popular Stocks"
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
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSort('symbol')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                sortBy === 'symbol'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Symbol {sortBy === 'symbol' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('price')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                sortBy === 'price'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Price {sortBy === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
        {loading && (
          <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> 
            Refreshing stock data...
          </div>
        )}
      </div>
      
      <DataLoadingPlaceholder
        isLoading={loading && sortedStocks.length === 0}
        isEmpty={sortedStocks.length === 0 && !loading}
        loadingMessage="Loading popular stocks..."
        emptyMessage={`No stocks found matching "${searchTerm}"`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} marketStatus={marketStatus} />
          ))}
        </div>
      </DataLoadingPlaceholder>
    </div>
  );
};

export default PopularStocks;
