import React from 'react';
import { Filter, Search, ArrowDownUp, TrendingUp, TrendingDown } from 'lucide-react';
import { popularStocks } from '../utils/mockData';
import { StockData } from '../types';
import { Link } from 'react-router-dom';

const Screener: React.FC = () => {
  const [filteredStocks, setFilteredStocks] = React.useState<StockData[]>(popularStocks);
  const [sortField, setSortField] = React.useState<keyof StockData>('symbol');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  
  // Filter states
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 500]);
  const [changeFilter, setChangeFilter] = React.useState<'all' | 'positive' | 'negative'>('all');
  const [marketCapFilter, setMarketCapFilter] = React.useState<'all' | 'large' | 'mid' | 'small'>('all');
  
  const handleSort = (field: keyof StockData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const applyFilters = () => {
    let result = [...popularStocks];
    
    // Price range filter
    result = result.filter(stock => 
      stock.price >= priceRange[0] && stock.price <= priceRange[1]
    );
    
    // Change filter
    if (changeFilter === 'positive') {
      result = result.filter(stock => stock.change > 0);
    } else if (changeFilter === 'negative') {
      result = result.filter(stock => stock.change < 0);
    }
    
    // Market cap filter
    if (marketCapFilter === 'large') {
      result = result.filter(stock => stock.marketCap >= 100000000000); // $100B+
    } else if (marketCapFilter === 'mid') {
      result = result.filter(stock => 
        stock.marketCap >= 10000000000 && stock.marketCap < 100000000000
      ); // $10B-$100B
    } else if (marketCapFilter === 'small') {
      result = result.filter(stock => stock.marketCap < 10000000000); // <$10B
    }
    
    // Sort
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
    
    setFilteredStocks(result);
  };
  
  // Apply filters when any filter changes
  React.useEffect(() => {
    applyFilters();
  }, [priceRange, changeFilter, marketCapFilter, sortField, sortDirection]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Filter className="h-6 w-6 text-blue-500 mr-2" />
        Stock Screener
      </h1>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range (${priceRange[0]} - ${priceRange[1]})
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          {/* Change Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Change
            </label>
            <select
              value={changeFilter}
              onChange={(e) => setChangeFilter(e.target.value as 'all' | 'positive' | 'negative')}
              className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="positive">Positive Only</option>
              <option value="negative">Negative Only</option>
            </select>
          </div>
          
          {/* Market Cap Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Market Cap
            </label>
            <select
              value={marketCapFilter}
              onChange={(e) => setMarketCapFilter(e.target.value as 'all' | 'large' | 'mid' | 'small')}
              className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="large">Large Cap ($100B+)</option>
              <option value="mid">Mid Cap ($10B-$100B)</option>
              <option value="small">Small Cap (Under $10B)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Results ({filteredStocks.length})
          </h2>
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredStocks.length} of {popularStocks.length} stocks
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center">
                    Symbol
                    {sortField === 'symbol' && (
                      <ArrowDownUp className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end">
                    Price
                    {sortField === 'price' && (
                      <ArrowDownUp className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('changePercent')}
                >
                  <div className="flex items-center justify-end">
                    Change
                    {sortField === 'changePercent' && (
                      <ArrowDownUp className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('marketCap')}
                >
                  <div className="flex items-center justify-end">
                    Market Cap
                    {sortField === 'marketCap' && (
                      <ArrowDownUp className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStocks.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/stock/${stock.symbol}`} className="text-blue-500 hover:text-blue-700 font-medium">
                      {stock.symbol}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{stock.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`flex items-center justify-end text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                    ${(stock.marketCap / 1000000000).toFixed(2)}B
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStocks.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No stocks match your current filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Screener;