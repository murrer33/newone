import React, { useState } from 'react';
import { TrendingUp, Search, ArrowUpDown } from 'lucide-react';
import { useStocks } from '../context/stockcontext';
import StockCard from '../components/StockCard';

const TrendingStocks: React.FC = () => {
  const { nasdaqStocks, bistStocks, loading, error } = useStocks();
  const allStocks = [...nasdaqStocks, ...bistStocks];
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
        Trending Stocks
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="relative w-full md:w-64">
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
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <ArrowUpDown className="h-5 w-5 text-green-500 mr-2" />
          Top Gainers
        </h2>
        {gainers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gainers.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No gainers found matching your search</p>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <ArrowUpDown className="h-5 w-5 text-red-500 mr-2 transform rotate-180" />
          Top Losers
        </h2>
        {losers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {losers.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No losers found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingStocks;
