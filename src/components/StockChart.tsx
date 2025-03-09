import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HistoricalData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StockChartProps {
  data: HistoricalData[];
  timeframe: '1D' | '5D' | '1W' | '1M' | '6M' | '1Y' | '5Y' | 'MAX';
  onTimeframeChange: (timeframe: '1D' | '5D' | '1W' | '1M' | '6M' | '1Y' | '5Y' | 'MAX') => void;
  realTimeData?: { price: number; timestamp: string }[];
}

const StockChart: React.FC<StockChartProps> = ({ 
  data, 
  timeframe, 
  onTimeframeChange,
  realTimeData 
}) => {
  // Combine historical data with real-time data for 1D view
  const chartData = {
    labels: timeframe === '1D' && realTimeData 
      ? realTimeData.map(item => new Date(item.timestamp).toLocaleTimeString())
      : data.map(item => item.date),
    datasets: [
      {
        label: 'Price',
        data: timeframe === '1D' && realTimeData
          ? realTimeData.map(item => item.price)
          : data.map(item => item.close),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 8,
          maxRotation: 0
        }
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toFixed(2);
          }
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    }
  };

  const timeframes: ('1D' | '5D' | '1W' | '1M' | '6M' | '1Y' | '5Y' | 'MAX')[] = 
    ['1D', '5D', '1W', '1M', '6M', '1Y', '5Y', 'MAX'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Price Chart</h3>
        <div className="flex space-x-2">
          {timeframes.map(period => (
            <button
              key={period}
              onClick={() => onTimeframeChange(period)}
              className={`px-3 py-1 text-sm rounded-md ${
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
      <div className="h-64">
        <Line data={chartData} options={options as any} />
      </div>
    </div>
  );
};

export default StockChart;