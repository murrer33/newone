import React from 'react';
import { Globe, TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';
import { useStocks } from '../context/StockContext';
import StockCard from '../components/StockCard';
import MarketStatusHeader from '../components/MarketStatusHeader';
import { useStockPageData } from '../hooks/useStockPageData';
import { Link } from 'react-router-dom';

const MarketPage: React.FC = () => {
  // const { nasdaqStocks, bistStocks } = useStocks();
  const { marketStatus } = useStockPageData();
  
  // Instead of using nasdaqStocks/bistStocks, use 3 hardcoded stocks
  const staticStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 172.99 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2834.50 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 709.67 },
  ];
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'symbol' | 'price'>('symbol'); // Removed 'change'
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (column: 'symbol' | 'price') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredStocks = staticStocks.filter(
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

  // Static market indices (could be fetched separately if needed)
  const marketIndices = [
    { name: 'S&P 500', value: '4,927.11', change: '+0.41%', isPositive: true },
    { name: 'Dow Jones', value: '38,239.98', change: '+0.56%', isPositive: true },
    { name: 'Nasdaq', value: '15,927.90', change: '-0.27%', isPositive: false },
    { name: 'Russell 2000', value: '2,018.56', change: '+0.12%', isPositive: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MarketStatusHeader
        title="Market Overview"
        marketStatus={marketStatus}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {marketIndices.map((index, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{index.name}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{index.value}</p>
            <div className="flex items-center mt-1">
              {index.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${index.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {index.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      
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
          <div className="flex items-center">
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
        </div>
        
        <div className="mt-4 flex items-center">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Market status:</span> {marketStatus.isOpen ? 'Open' : 'Closed'} • 
            <span className="ml-1">{marketStatus.isOpen ? 'Showing real-time prices' : 'Showing last closing prices'}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {staticStocks.map((stock) => (
          <Link key={stock.symbol} to={`/stock/${stock.symbol}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 block hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{stock.symbol}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">{stock.name}</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">${stock.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MarketPage;
