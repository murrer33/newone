import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Scale,
  Clock,
  Users,
  Search,
  Plus,
  X,
  Lock,
  Sun,
  Moon,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
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

type Plan = 'free' | 'plus' | 'pro';
type Timeframe = '1D' | '5D' | '1W' | '1M' | '6M' | '1Y' | '5Y' | 'MAX';

const DemoStock: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">Demo is currently disabled.</h1>
    </div>
  );
};

export default DemoStock; 