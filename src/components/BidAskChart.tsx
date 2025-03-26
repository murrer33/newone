import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
} from 'chart.js';
import { BidAskHistoryItem } from '../hooks/useBidAsk';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface BidAskChartProps {
  data: BidAskHistoryItem[];
  loading: boolean;
  error: string | null;
}

const BidAskChart: React.FC<BidAskChartProps> = ({ data, loading, error }) => {
  const [chartData, setChartData] = useState<any>({ datasets: [] });
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});

  useEffect(() => {
    if (data.length === 0) return;

    // Extract timestamps, bid prices, and ask prices from data
    const timestamps = data.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    });
    
    const bidPrices = data.map(item => item.bidPrice);
    const askPrices = data.map(item => item.askPrice);
    
    // Calculate spread values
    const spreads = data.map(item => {
      if (item.bidPrice !== null && item.askPrice !== null) {
        return item.askPrice - item.bidPrice;
      }
      return null;
    });

    // Define chart data
    setChartData({
      labels: timestamps,
      datasets: [
        {
          label: 'Bid Price',
          data: bidPrices,
          borderColor: 'rgba(59, 130, 246, 1)', // Blue
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderWidth: 2,
          pointRadius: 2,
          tension: 0.1,
          fill: false,
        },
        {
          label: 'Ask Price',
          data: askPrices,
          borderColor: 'rgba(239, 68, 68, 1)', // Red
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderWidth: 2,
          pointRadius: 2,
          tension: 0.1,
          fill: false,
        },
        {
          label: 'Spread',
          data: spreads,
          borderColor: 'rgba(16, 185, 129, 1)', // Green
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderWidth: 1,
          pointRadius: 0,
          borderDash: [5, 5],
          yAxisID: 'y1',
        }
      ]
    });

    // Define chart options
    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            boxWidth: 10,
          },
        },
        title: {
          display: true,
          text: 'Bid/Ask Prices Over Time',
          color: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : 'black',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10,
          },
          grid: {
            display: false,
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Price ($)',
          },
          grid: {
            // Removed borderDash property to fix linter error
            // borderDash: [2, 2],
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Spread ($)',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
      },
    });
  }, [data]);

  if (loading && data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="h-64 flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p className="text-xl">Error loading chart data</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <p className="text-xl">No Data Available</p>
            <p className="text-sm mt-2">There is currently no bid/ask data to display.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="h-64">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default BidAskChart; 