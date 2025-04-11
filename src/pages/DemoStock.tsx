import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import { 
  ArrowUp, ArrowDown, TrendingUp, TrendingDown, 
  DollarSign, Percent, Clock, Activity, 
  BarChart2, LineChart as LineChartIcon, CandlestickChart
} from 'lucide-react';
import MarketStatusHeader from '../components/MarketStatusHeader';
import StockStats from '../components/StockStats';
import TechnicalIndicator from '../components/TechnicalIndicator';
import NewsAnalysis from '../components/NewsAnalysis';
import SentimentAnalysisCard from '../components/SentimentAnalysisCard';
import DataLoadingPlaceholder from '../components/DataLoadingPlaceholder';
import {
  generateHistoricalData,
  generateTechnicalIndicators,
  generateStockPredictions,
  generateSocialSentiment,
  generateStockNews,
} from '../utils/mockData';
import { HistoricalData } from '../types';

// Mock stock data
const mockStocks = [
  { symbol: 'TECH', name: 'Tech Innovations Inc.', price: 125.45, change: 2.34, changePercent: 1.9 },
  { symbol: 'FINT', name: 'Financial Tech Corp', price: 89.67, change: -1.23, changePercent: -1.35 },
  { symbol: 'INNO', name: 'Innovation Systems', price: 156.78, change: 3.45, changePercent: 2.25 },
  { symbol: 'DIGI', name: 'Digital Solutions', price: 112.34, change: -0.89, changePercent: -0.79 },
  { symbol: 'SMART', name: 'Smart Technologies', price: 145.67, change: 4.56, changePercent: 3.24 }
];

// Mock historical data
const generateHistoricalData = () => {
  const data = [];
  const basePrice = 100;
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const price = basePrice + Math.random() * 20 - 10;
    data.push({
      date: date.toISOString().split('T')[0],
      price: price,
      bid: price - Math.random() * 0.5,
      ask: price + Math.random() * 0.5,
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  }
  return data;
};

// Mock prediction data
const generatePredictionData = () => {
  const data = [];
  const basePrice = 100;
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const price = basePrice + Math.random() * 10 - 5;
    data.push({
      date: date.toISOString().split('T')[0],
      predicted: price,
      confidence: Math.random() * 0.2 + 0.7
    });
  }
  return data;
};

// Mock technical indicators
const generateTechnicalIndicators = () => {
  return {
    rsi: Math.random() * 30 + 35,
    macd: Math.random() * 2 - 1,
    bollinger: {
      upper: 110,
      middle: 100,
      lower: 90
    }
  };
};

const DemoStock: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState(mockStocks[0]);
  const [timeframe, setTimeframe] = useState('1D');
  const [historicalData] = useState(generateHistoricalData());
  const [predictionData] = useState(generatePredictionData());
  const [technicalIndicators] = useState(generateTechnicalIndicators());
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleStockSelect = (stock: typeof mockStocks[0]) => {
    setSelectedStock(stock);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Stock Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {mockStocks.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => handleStockSelect(stock)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedStock.symbol === stock.symbol
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{stock.symbol}</h3>
                    <p className="text-sm text-gray-500">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${stock.price.toFixed(2)}</p>
                    <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{selectedStock.symbol} Price Chart</h2>
                <div className="flex space-x-2">
                  {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1 rounded-md ${
                        timeframe === tf ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bid/Ask Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Bid/Ask Spread</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="bid" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="ask" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Prediction Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Price Predictions</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Stock Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Stock Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="text-gray-500" />
                    <span className="text-gray-500">Current Price</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">${selectedStock.price.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Percent className="text-gray-500" />
                    <span className="text-gray-500">Change</span>
                  </div>
                  <p className={`text-2xl font-semibold mt-2 ${selectedStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="text-gray-500" />
                    <span className="text-gray-500">Volume</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">
                    {(historicalData[historicalData.length - 1].volume / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-gray-500" />
                    <span className="text-gray-500">Last Update</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Indicators */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Technical Indicators</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">RSI (14)</span>
                    <span className={`font-semibold ${technicalIndicators.rsi > 70 ? 'text-red-600' : technicalIndicators.rsi < 30 ? 'text-green-600' : 'text-gray-900'}`}>
                      {technicalIndicators.rsi.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${technicalIndicators.rsi}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">MACD</span>
                    <span className={`font-semibold ${technicalIndicators.macd > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {technicalIndicators.macd.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bollinger Bands</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Upper: ${technicalIndicators.bollinger.upper.toFixed(2)}</span>
                      <span>Middle: ${technicalIndicators.bollinger.middle.toFixed(2)}</span>
                      <span>Lower: ${technicalIndicators.bollinger.lower.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Available Features</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Real-time Price Updates</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Technical Analysis</span>
                  <span className={selectedPlan === 'free' ? 'text-gray-400' : 'text-green-600'}>
                    {selectedPlan === 'free' ? '✗' : '✓'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price Predictions</span>
                  <span className={selectedPlan !== 'pro' ? 'text-gray-400' : 'text-green-600'}>
                    {selectedPlan !== 'pro' ? '✗' : '✓'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Advanced Charts</span>
                  <span className={selectedPlan === 'free' ? 'text-gray-400' : 'text-green-600'}>
                    {selectedPlan === 'free' ? '✗' : '✓'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoStock; 