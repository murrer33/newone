import React from 'react';
import { Filter, Search, ArrowDownUp, RefreshCw } from 'lucide-react';
import { useStocks } from '../context/StockContext';
import { Link } from 'react-router-dom';
import MarketStatusHeader from '../components/MarketStatusHeader';
import DataLoadingPlaceholder from '../components/DataLoadingPlaceholder';
import { useStockPageData } from '../hooks/useStockPageData';

const Screener: React.FC = () => {
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
  const [filteredStocks, setFilteredStocks] = React.useState(allStocks);
  const [sortField, setSortField] = React.useState<'symbol' | 'price'>('symbol');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 500]);

  const handleSort = (field: 'symbol' | 'price') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  React.useEffect(() => {
    if (loading) return;
    let result = [...allStocks];
    result = result.filter((stock) => stock.price >= priceRange[0] && stock.price <= priceRange[1]);
    result.sort((a, b) => {
      if (sortField === 'symbol') {
        return sortDirection === 'asc'
          ? a.symbol.localeCompare(b.symbol)
          : b.symbol.localeCompare(a.symbol);
      } else {
        // For price field, which is a number
        return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
      }
    });
    setFilteredStocks(result);
  }, [priceRange, sortField, sortDirection, loading, allStocks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MarketStatusHeader
        title="Stock Screener"
        loading={loading}
        error={error}
        marketStatus={marketStatus}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
      />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
      </div>
      
      <DataLoadingPlaceholder
        isLoading={loading && filteredStocks.length === 0}
        isEmpty={filteredStocks.length === 0 && !loading}
        loadingMessage="Loading stocks for screening..."
        emptyMessage="No stocks match your current filters"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              Results ({filteredStocks.length})
              <span className="text-sm ml-2 font-normal text-gray-500">
                ({marketStatus.isOpen ? 'Real-time prices' : 'Last closing prices'})
                {loading && <span className="ml-1 text-sm font-normal text-gray-500 inline-flex items-center">(Refreshing <RefreshCw className="ml-1 h-3 w-3 animate-spin" />)</span>}
              </span>
            </h2>
            <div className="flex items-center">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredStocks.length} of {allStocks.length} stocks
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
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
                      <div className="text-xs text-gray-500">{getPriceTypeMessage()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ${stock.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DataLoadingPlaceholder>
    </div>
  );
};

export default Screener;
