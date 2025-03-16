export interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  historicalData: HistoricalData[];
  technicalIndicators: TechnicalIndicator[];
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor?: string;
    fill?: boolean;
    tension?: number;
    borderWidth?: number;
    pointRadius?: number;
    pointHoverRadius?: number;
  }[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  interaction: {
    mode: 'index' | 'nearest' | 'x' | 'y';
    intersect: boolean;
  };
  scales?: {
    x?: {
      display: boolean;
      grid?: {
        display: boolean;
      };
    };
    y?: {
      display: boolean;
      grid?: {
        display: boolean;
      };
      min?: number;
      max?: number;
    };
  };
  plugins?: {
    legend?: {
      display: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      mode: 'index' | 'nearest' | 'x' | 'y';
      intersect: boolean;
      callbacks?: {
        label?: (context: any) => string;
      };
    };
  };
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal?: 'buy' | 'sell' | 'neutral';
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