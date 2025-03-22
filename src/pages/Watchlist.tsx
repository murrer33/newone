import React from 'react';
import { Eye, Plus, Trash2, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { popularStocks } from '../utils/mockData';
import { StockData } from '../types';
import { Link } from 'react-router-dom';
import MarketStatusHeader from '../components/MarketStatusHeader';
import DataLoadingPlaceholder from '../components/DataLoadingPlaceholder';
import { useStockPageData } from '../hooks/useStockPageData';

const Watchlist: React.FC = () => {
  // In a real app, this would be stored in a database or localStorage
  const [watchlist, setWatchlist] = React.useState<StockData[]>(
    popularStocks.slice(0, 3) // Start with a few stocks for demo
  );
  
  const [newStockSymbol, setNewStockSymbol] = React.useState('');

  // Use our custom hook for market status
  const { 
    loading: stocksLoading, 
    error: stocksError, 
    marketStatus,
    lastUpdated,
    handleRefresh,
    getPriceTypeMessage
  } = useStockPageData();
  
  const handleAddStock = () => {
    if (!newStockSymbol) return;
    
    const stockToAdd = popularStocks.find(
      stock => stock.symbol.toLowerCase() === newStockSymbol.toLowerCase()
    );
    
    if (stockToAdd && !watchlist.some(stock => stock.symbol === stockToAdd.symbol)) {
      setWatchlist([...watchlist, stockToAdd]);
    }
    
    setNewStockSymbol('');
  };
  
  const handleRemoveStock = (symbol: string) => {
    setWatchlist(watchlist.filter(stock => stock.symbol !== symbol));
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MarketStatusHeader
        title="My Watchlist"
        loading={stocksLoading}
        error={stocksError}
        marketStatus={marketStatus}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
      />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Eye className="h-5 w-5 text-blue-500 mr-2" />
          Tracked Stocks
          <span className="text-sm ml-2 font-normal text-gray-500">
            ({marketStatus.isOpen ? 'Real-time prices' : 'Last closing prices'})
            {stocksLoading && <span className="ml-1 text-sm font-normal text-gray-500 inline-flex items-center">(Refreshing <RefreshCw className="ml-1 h-3 w-3 animate-spin" />)</span>}
          </span>
        </h2>
        
        <div className="flex">
          <input
            type="text"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add stock symbol..."
            value={newStockSymbol}
            onChange={(e) => setNewStockSymbol(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddStock()}
          />
          <button
            onClick={handleAddStock}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add
          </button>
        </div>
      </div>
      
      <DataLoadingPlaceholder
        isLoading={stocksLoading && watchlist.length === 0}
        isEmpty={watchlist.length === 0}
        loadingMessage="Loading your watchlist..."
        emptyMessage="Your watchlist is empty. Add stocks to track their performance."
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Symbol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Change
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {watchlist.map((stock) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemoveStock(stock.symbol)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataLoadingPlaceholder>
    </div>
  );
};

export default Watchlist;