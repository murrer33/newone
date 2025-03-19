import React from 'react';
import { Eye, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { popularStocks } from '../utils/mockData';
import { StockData } from '../types';
import { Link } from 'react-router-dom';

const Watchlist: React.FC = () => {
  // In a real app, this would be stored in a database or localStorage
  const [watchlist, setWatchlist] = React.useState<StockData[]>(
    popularStocks.slice(0, 3) // Start with a few stocks for demo
  );
  
  const [newStockSymbol, setNewStockSymbol] = React.useState('');
  
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Eye className="h-6 w-6 text-blue-500 mr-2" />
          My Watchlist
        </h1>
        
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
      
      {watchlist.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your watchlist is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Add stocks to your watchlist to track their performance
          </p>
        </div>
      ) : (
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${stock.currentPrice.toFixed(2)}
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
      )}
    </div>
  );
};

export default Watchlist;