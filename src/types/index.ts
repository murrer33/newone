export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  description: string;
}

export interface StockPrediction {
  timeframe: string;
  predictedPrice: number;
  confidence: number;
  direction: 'up' | 'down' | 'sideways';
}

export interface SocialMediaSentiment {
  platform: 'twitter' | 'reddit' | 'stocktwits' | 'youtube' | 'news';
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  volume: number;
  change: number;
}

export interface NewsItem {
  title: string;
  source: string;
  time: string;
  url: string;
  image: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}

export interface SentimentAnalysis {
  overall: number; // -100 to 100
  breakdown: SocialMediaSentiment[];
  trending: string[];
}