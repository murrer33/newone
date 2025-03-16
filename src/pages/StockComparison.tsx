import React, { useState } from 'react';
import { Scale, Search, X, Plus, BarChart3 } from 'lucide-react';
import { useStocks } from '../context/StockContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { generateHistoricalData } from '../utils/mockData'; // Keep for chart data
import { StockData } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockComparison: React.FC = () => {
  const { nasdaqStocks, bistStocks, loading, error } = useStocks();
  const allStocks = [...nasdaqStocks, ...bistStocks];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStocks, setSelectedStocks] = useState<StockData[]>([]);
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '3M' | '1Y'>('1M');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredStocks = allStocks.filter(
    (stock: StockData) =>
      !selectedStocks.some((s) => s.symbol === stock.symbol) &&
      (stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddStock = (stock: StockData) => {
    if (selectedStocks.length < 4) {
      setSelectedStocks([...selectedStocks, stock]);
      setSearchTerm('');
    }
  };

  const handleRemoveStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter((stock) => stock.symbol !== symbol));
  };

  const generateComparisonChart = () => {
    if (selectedStocks.length === 0) return null;
    const days = timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
    const datasets = selectedStocks.map((stock, index) => {
      const historicalData = generateHistoricalData(stock.symbol, days);
      const firstDayPrice = historicalData[0].close;
      const normalizedData = historicalData.map((day) => ({
        ...day,
        normalizedClose: ((day.close - firstDayPrice) / firstDayPrice) * 100,
      }));
      const colors = [
        { border: 'rgb(59, 130, 246)', background: 'rgba(59, 130, 246, 0.1)' },
        { border: 'rgb(16, 185, 129)', background: 'rgba(16, 185, 129, 0.1)' },
        { border: 'rgb(249, 115, 22)', background: 'rgba(249, 115, 22, 0.1)' },
        { border: 'rgb(139, 92, 246)', background: 'rgba(139, 92, 246, 0.1)' },
      ];
      return {
        label: stock.symbol,
        data: normalizedData.map((day) => day.normalizedClose),
        borderColor: colors[index].border,
        backgroundColor: colors[index].background,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.4,
      };
    });
    const chartData: ChartData<'line'> = {
      labels: generateHistoricalData(selectedStocks[0].symbol, days).map((day) => day.date),
      datasets,
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' as const },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          callbacks: {
            label: function (context: any) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 8, maxRotation: 0 } },
        y: {
          grid: { color: 'rgba(200, 200, 200, 0.2)' },
          ticks: { callback: (value: any) => value + '%' },
          title: { display: true, text: 'Percentage Change' },
        },
      },
      interaction: { mode: 'index' as const, intersect: false },
    };
    return { chartData, options };
  };

  const chartConfig = generateComparisonChart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Scale className="h-6 w-6 text-blue-500 mr-2" />
        Stock Comparison
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Stocks to Compare</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full"
            >
              <span className="font-medium">{stock.symbol}</span>
              <button
                onClick={() => handleRemoveStock(stock.symbol)}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {selectedStocks.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Select up to 4 stocks to compare their performance
            </p>
          )}
        </div>
        <div className="flex">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for a stock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={selectedStocks.length >= 4}
            />
          </div>
        </div>
        {searchTerm && (
          <div className="mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm max-h-60 overflow-y-auto">
            {filteredStocks.length > 0 ? (
              filteredStocks.slice(0, 5).map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  onClick={() => handleAddStock(stock)}
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{stock.symbol}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</p>
                  </div>
                  <button className="text-blue-500 hover:text-blue-700">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                No stocks found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
            Performance Comparison
          </h2>
          <div className="flex space-x-2">
            {(['1W', '1M', '3M', '1Y'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-2 py-1 text-xs rounded ${
                  timeframe === period
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        {selectedStocks.length > 0 ? (
          <div className="h-80">
            <Line data={chartConfig?.chartData} options={chartConfig?.options} />
          </div>
        ) : (
          <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <BarChart3 className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Select stocks to compare their performance
            </p>
          </div>
        )}
        {selectedStocks.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Chart shows percentage change from the beginning of the selected time period.
            </p>
          </div>
        )}
      </div>
      {selectedStocks.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {selectedStocks.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${stock.currentPrice.toFixed(2)}
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

export default StockComparison;
