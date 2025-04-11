import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock stock data
const mockStockData = {
  name: 'TechCorp Inc.',
  symbol: 'TCI',
  currentPrice: 245.67,
  change: 12.34,
  changePercent: 5.28,
  marketCap: '125.4B',
  volume: '2.3M',
  peRatio: 28.5,
  dividendYield: '1.2%',
  chartData: {
    labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
    datasets: [
      {
        label: 'Price',
        data: [230, 232, 235, 238, 240, 242, 243, 244, 245, 246, 245, 246, 247, 245.67],
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      }
    ]
  }
};

// Plan features
const planFeatures = {
  basic: [
    { name: 'Basic Technical Analysis', description: 'Simple moving averages and volume analysis', tokens: 0 },
    { name: 'Company Overview', description: 'Basic company information and financials', tokens: 0 },
    { name: 'Market News', description: 'Latest market news and updates', tokens: 0 }
  ],
  intermediate: [
    { name: 'Advanced Technical Analysis', description: 'RSI, MACD, and Bollinger Bands', tokens: 0 },
    { name: 'Detailed Fundamentals', description: 'In-depth financial statements and ratios', tokens: 0 },
    { name: 'Live Price Updates', description: 'Real-time stock price updates', tokens: 0 },
    { name: 'Social Media Sentiment', description: 'Basic sentiment analysis from social media', tokens: 5 }
  ],
  advanced: [
    { name: 'AI Price Prediction', description: 'Machine learning based price predictions', tokens: 10 },
    { name: 'Advanced Sentiment Analysis', description: 'Deep learning sentiment analysis from multiple sources', tokens: 8 },
    { name: 'Custom Alerts', description: 'Create custom price and volume alerts', tokens: 0 },
    { name: 'Portfolio Integration', description: 'Sync with your investment portfolio', tokens: 0 },
    { name: 'Expert Analysis', description: 'Access to expert stock analysis and recommendations', tokens: 15 }
  ]
};

const DemoStock: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'intermediate' | 'advanced'>('basic');

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  const renderFeature = (feature: { name: string; description: string; tokens: number }, isIncluded: boolean) => (
    <div className={`p-4 rounded-lg border ${isIncluded ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-medium ${isIncluded ? 'text-blue-900' : 'text-gray-500'}`}>{feature.name}</h3>
          <p className={`text-sm ${isIncluded ? 'text-blue-700' : 'text-gray-400'}`}>{feature.description}</p>
        </div>
        {!isIncluded && (
          <span className="text-sm font-medium text-gray-500">
            🔒 Unlock with {feature.tokens} Tokens
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Plan Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['basic', 'intermediate', 'advanced'].map((plan) => (
              <button
                key={plan}
                onClick={() => setSelectedPlan(plan as 'basic' | 'intermediate' | 'advanced')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedPlan === plan
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="text-lg font-semibold capitalize">{plan} Plan</h3>
              </button>
            ))}
          </div>
        </div>

        {/* Stock Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mockStockData.name}</h1>
              <p className="text-gray-500">{mockStockData.symbol}</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-3xl font-bold text-gray-900">${mockStockData.currentPrice}</p>
              <p className={`text-sm ${mockStockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {mockStockData.change >= 0 ? '+' : ''}{mockStockData.change} ({mockStockData.changePercent}%)
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 mb-6">
            <Line data={mockStockData.chartData} options={chartOptions} />
          </div>

          {/* Stock Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Market Cap</p>
              <p className="font-semibold">{mockStockData.marketCap}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Volume</p>
              <p className="font-semibold">{mockStockData.volume}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">P/E Ratio</p>
              <p className="font-semibold">{mockStockData.peRatio}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Dividend Yield</p>
              <p className="font-semibold">{mockStockData.dividendYield}</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planFeatures.basic.map((feature) => renderFeature(feature, true))}
            {planFeatures.intermediate.map((feature) => 
              renderFeature(feature, selectedPlan === 'intermediate' || selectedPlan === 'advanced')
            )}
            {planFeatures.advanced.map((feature) => 
              renderFeature(feature, selectedPlan === 'advanced')
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoStock; 