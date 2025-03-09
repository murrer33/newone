import { StockData, HistoricalData, TechnicalIndicator, StockPrediction, SocialMediaSentiment, NewsItem, SentimentAnalysis } from '../types';

// BIST100 stocks
const bist100Stocks: StockData[] = [
  {
    symbol: 'AKBNK',
    name: 'Akbank',
    price: 42.76,
    change: 0.86,
    changePercent: 2.05,
    volume: 15234567,
    marketCap: 222380000000
  },
  {
    symbol: 'GARAN',
    name: 'Garanti BBVA',
    price: 44.90,
    change: 0.92,
    changePercent: 2.09,
    volume: 18765432,
    marketCap: 188580000000
  },
  {
    symbol: 'THYAO',
    name: 'Turkish Airlines',
    price: 234.80,
    change: -2.30,
    changePercent: -0.97,
    volume: 12345678,
    marketCap: 323820000000
  },
  {
    symbol: 'EREGL',
    name: 'Eregli Iron and Steel',
    price: 41.86,
    change: 0.44,
    changePercent: 1.06,
    volume: 9876543,
    marketCap: 146510000000
  },
  {
    symbol: 'KCHOL',
    name: 'Koc Holding',
    price: 101.50,
    change: 1.50,
    changePercent: 1.50,
    volume: 7654321,
    marketCap: 257380000000
  }
];

// Top 50 NASDAQ stocks
const nasdaqStocks: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 187.32,
    change: 1.25,
    changePercent: 0.67,
    volume: 52436789,
    marketCap: 2950000000000
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 2.34,
    changePercent: 0.62,
    volume: 21345678,
    marketCap: 2810000000000
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.56,
    change: -0.87,
    changePercent: -0.61,
    volume: 18765432,
    marketCap: 1790000000000
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.12,
    change: 1.56,
    changePercent: 0.88,
    volume: 32145678,
    marketCap: 1840000000000
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.35,
    change: 15.67,
    changePercent: 1.82,
    volume: 28765432,
    marketCap: 2160000000000
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 472.22,
    change: 5.67,
    changePercent: 1.21,
    volume: 19876543,
    marketCap: 1210000000000
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 245.67,
    change: -3.45,
    changePercent: -1.39,
    volume: 65432198,
    marketCap: 780000000000
  },
  {
    symbol: 'AVGO',
    name: 'Broadcom Inc.',
    price: 1287.89,
    change: 22.45,
    changePercent: 1.77,
    volume: 3456789,
    marketCap: 598000000000
  },
  {
    symbol: 'PEP',
    name: 'PepsiCo, Inc.',
    price: 167.83,
    change: -0.45,
    changePercent: -0.27,
    volume: 4567890,
    marketCap: 230000000000
  },
  {
    symbol: 'COST',
    name: 'Costco Wholesale',
    price: 742.56,
    change: 5.67,
    changePercent: 0.77,
    volume: 2345678,
    marketCap: 329000000000
  }
];

// Combine all stocks
export const popularStocks: StockData[] = [...nasdaqStocks, ...bist100Stocks];

// Generate mock historical data for a stock
export const generateHistoricalData = (symbol: string, days: number = 30): HistoricalData[] => {
  const data: HistoricalData[] = [];
  let basePrice = popularStocks.find(stock => stock.symbol === symbol)?.price || 100;
  
  // Adjust base price to make the chart look more realistic
  basePrice = basePrice * 0.9;
  
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Create some volatility
    const volatility = 0.02;
    const randomChange = basePrice * volatility * (Math.random() - 0.5);
    
    // Add a trend component
    const trendFactor = 0.001;
    const trend = basePrice * trendFactor * (days - i);
    
    basePrice = basePrice + randomChange + trend;
    
    const open = basePrice;
    const high = open * (1 + Math.random() * 0.02);
    const low = open * (1 - Math.random() * 0.02);
    const close = (open + high + low) / 3 + (Math.random() - 0.5) * 2;
    const volume = Math.floor(Math.random() * 10000000) + 5000000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume
    });
  }
  
  return data;
};

// Generate technical indicators for a stock
export const generateTechnicalIndicators = (symbol: string): TechnicalIndicator[] => {
  const stock = popularStocks.find(s => s.symbol === symbol);
  
  if (!stock) {
    return [];
  }
  
  const randomSignal = (): 'buy' | 'sell' | 'neutral' => {
    const rand = Math.random();
    if (rand < 0.4) return 'buy';
    if (rand < 0.7) return 'sell';
    return 'neutral';
  };
  
  return [
    {
      name: 'RSI (14)',
      value: Math.floor(Math.random() * 100),
      signal: randomSignal(),
      description: 'Relative Strength Index measures the speed and change of price movements.'
    },
    {
      name: 'MACD',
      value: +(Math.random() * 2 - 1).toFixed(2),
      signal: randomSignal(),
      description: 'Moving Average Convergence Divergence is a trend-following momentum indicator.'
    },
    {
      name: 'SMA (50)',
      value: stock.price * (1 + (Math.random() * 0.1 - 0.05)),
      signal: randomSignal(),
      description: '50-day Simple Moving Average shows the average closing price over the last 50 days.'
    },
    {
      name: 'EMA (20)',
      value: stock.price * (1 + (Math.random() * 0.08 - 0.04)),
      signal: randomSignal(),
      description: '20-day Exponential Moving Average gives more weight to recent prices.'
    },
    {
      name: 'Bollinger Bands',
      value: stock.price * (1 + (Math.random() * 0.06 - 0.03)),
      signal: randomSignal(),
      description: 'Bollinger Bands consist of a middle band with two outer bands that help measure volatility.'
    },
    {
      name: 'Stochastic Oscillator',
      value: Math.floor(Math.random() * 100),
      signal: randomSignal(),
      description: 'Stochastic Oscillator is a momentum indicator comparing a closing price to its price range.'
    }
  ];
};

// Generate stock predictions
export const generateStockPredictions = (symbol: string): StockPrediction[] => {
  const stock = popularStocks.find(s => s.symbol === symbol);
  
  if (!stock) {
    return [];
  }
  
  const randomDirection = (): 'up' | 'down' | 'sideways' => {
    const rand = Math.random();
    if (rand < 0.5) return 'up';
    if (rand < 0.8) return 'down';
    return 'sideways';
  };
  
  return [
    {
      timeframe: '1 Day',
      predictedPrice: stock.price * (1 + (Math.random() * 0.04 - 0.02)),
      confidence: Math.floor(Math.random() * 30) + 60,
      direction: randomDirection()
    },
    {
      timeframe: '1 Week',
      predictedPrice: stock.price * (1 + (Math.random() * 0.08 - 0.03)),
      confidence: Math.floor(Math.random() * 30) + 50,
      direction: randomDirection()
    },
    {
      timeframe: '1 Month',
      predictedPrice: stock.price * (1 + (Math.random() * 0.15 - 0.05)),
      confidence: Math.floor(Math.random() * 30) + 40,
      direction: randomDirection()
    }
  ];
};

// Get stock data by symbol
export const getStockBySymbol = (symbol: string): StockData | undefined => {
  return popularStocks.find(stock => stock.symbol === symbol);
};

// Generate social media sentiment data
export const generateSocialSentiment = (symbol: string): SentimentAnalysis => {
  const stock = popularStocks.find(s => s.symbol === symbol);
  
  if (!stock) {
    return {
      overall: 0,
      breakdown: [],
      trending: []
    };
  }
  
  // Generate random sentiment score between -100 and 100
  const overallSentiment = Math.floor(Math.random() * 200) - 100;
  
  const platforms: ('twitter' | 'reddit' | 'stocktwits' | 'youtube' | 'news')[] = 
    ['twitter', 'reddit', 'stocktwits', 'youtube', 'news'];
  
  const breakdown: SocialMediaSentiment[] = platforms.map(platform => {
    // Generate sentiment that somewhat correlates with overall sentiment
    const baseSentiment = overallSentiment / 100; // -1 to 1
    const randomFactor = (Math.random() - 0.5) * 0.5; // -0.25 to 0.25
    const sentimentScore = baseSentiment + randomFactor;
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    if (sentimentScore > 0.2) sentiment = 'positive';
    else if (sentimentScore < -0.2) sentiment = 'negative';
    else sentiment = 'neutral';
    
    // Convert to 0-100 scale
    const score = Math.floor((sentimentScore + 1) * 50);
    
    return {
      platform,
      sentiment,
      score,
      volume: Math.floor(Math.random() * 10000) + 1000,
      change: Math.floor(Math.random() * 40) - 20
    };
  });
  
  // Generate trending topics based on stock
  const baseTrends = ['earnings', 'growth', 'revenue', 'product', 'CEO', 'market', 'competition'];
  const companySpecificTrends: Record<string, string[]> = {
    'AAPL': ['iPhone', 'MacBook', 'iOS', 'Tim Cook', 'App Store'],
    'MSFT': ['Windows', 'Azure', 'Office', 'Satya Nadella', 'Teams'],
    'GOOGL': ['Search', 'Android', 'YouTube', 'Sundar Pichai', 'Ads'],
    'AMZN': ['Prime', 'AWS', 'Retail', 'Andy Jassy', 'Logistics'],
    'TSLA': ['EV', 'Elon Musk', 'Autopilot', 'Gigafactory', 'SpaceX'],
    'META': ['Facebook', 'Instagram', 'Metaverse', 'Mark Zuckerberg', 'Ads'],
    'AKBNK': ['Banking', 'Interest Rates', 'Digital Banking', 'Credit', 'Turkey'],
    'THYAO': ['Aviation', 'Tourism', 'Fleet', 'Routes', 'Cargo'],
    'GARAN': ['Banking', 'BBVA', 'Mobile Banking', 'Turkey', 'Finance'],
    'EREGL': ['Steel', 'Manufacturing', 'Export', 'Industry', 'Metal'],
    'KCHOL': ['Holding', 'Conglomerate', 'Industry', 'Energy', 'Automotive']
  };
  
  const specificTrends = companySpecificTrends[symbol] || [];
  const allTrends = [...baseTrends, ...specificTrends];
  
  // Select random trending topics
  const trendCount = Math.floor(Math.random() * 5) + 3; // 3-7 trends
  const trending: string[] = [];
  
  for (let i = 0; i < trendCount; i++) {
    const randomIndex = Math.floor(Math.random() * allTrends.length);
    const trend = allTrends[randomIndex];
    
    if (!trending.includes(trend)) {
      trending.push(trend);
    }
  }
  
  return {
    overall: overallSentiment,
    breakdown,
    trending
  };
};

// Generate news for a stock
export const generateStockNews = (symbol: string): NewsItem[] => {
  const stock = popularStocks.find(s => s.symbol === symbol);
  
  if (!stock) {
    return [];
  }
  
  const newsTemplates: Record<string, NewsItem[]> = {
    'AKBNK': [
      {
        title: 'Akbank Reports Strong Q4 Digital Banking Growth',
        source: 'Bloomberg',
        time: '2 hours ago',
        url: '#',
        image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
        sentiment: 'positive',
        impact: 'high'
      },
      {
        title: 'Akbank Expands Digital Payment Solutions',
        source: 'Reuters',
        time: '5 hours ago',
        url: '#',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
        sentiment: 'positive',
        impact: 'medium'
      },
      {
        title: 'Turkish Banking Sector Analysis: Akbank Leading Digital Transformation',
        source: 'Financial Times',
        time: '1 day ago',
        url: '#',
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
        sentiment: 'positive',
        impact: 'medium'
      }
    ],
    'THYAO': [
      {
        title: 'Turkish Airlines Adds New International Routes',
        source: 'CNBC',
        time: '3 hours ago',
        url: '#',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
        sentiment: 'positive',
        impact: 'high'
      },
      {
        title: 'THY Reports Record Passenger Numbers in Q4',
        source: 'Reuters',
        time: '6 hours ago',
        url: '#',
        image: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
        sentiment: 'positive',
        impact: 'high'
      },
      {
        title: 'Turkish Airlines Expands Cargo Operations',
        source: 'Bloomberg',
        time: '1 day ago',
        url: '#',
        image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
        sentiment: 'positive',
        impact: 'medium'
      }
    ],
    'AAPL': [
      {
        title: 'Apple Reports Record iPhone Sales in Q2',
        source: 'Bloomberg',
        time: '2 hours ago',
        url: '#',
        image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
        sentiment: 'positive',
        impact: 'high'
      },
      {
        title: 'New MacBook Pro with M3 Chip Faces Supply Chain Constraints',
        source: 'Reuters',
        time: '5 hours ago',
        url: '#',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
        sentiment: 'negative',
        impact: 'medium'
      },
      {
        title: 'Apple Expands AI Features in iOS 18',
        source: 'TechCrunch',
        time: '1 day ago',
        url: '#',
        image: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
        sentiment: 'positive',
        impact: 'medium'
      }
    ]
  };
  
  // Return stock-specific news if available, otherwise generate generic news
  if (newsTemplates[symbol]) {
    return newsTemplates[symbol];
  }
  
  // Generate generic news
  return [
    {
      title: `${stock.name} Reports Quarterly Earnings`,
      source: 'Financial Times',
      time: '3 hours ago',
      url: '#',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      sentiment: 'neutral',
      impact: 'medium'
    },
    {
      title: `Analysts Upgrade ${stock.symbol} Stock Rating`,
      source: 'Wall Street Journal',
      time: '6 hours ago',
      url: '#',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      sentiment: 'positive',
      impact: 'medium'
    },
    {
      title: `${stock.name} Announces New Strategic Initiative`,
      source: 'Bloomberg',
      time: '1 day ago',
      url: '#',
      image: 'https://images.unsplash.com/photo-1582486225644-dce7c7d85ff5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      sentiment: 'positive',
      impact: 'high'
    }
  ];
};

// Generate market news
export const generateMarketNews = (): NewsItem[] => {
  return [
    {
      title: 'Fed Signals Potential Rate Cut in Coming Months',
      source: 'Financial Times',
      time: '2 hours ago',
      url: '#',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      sentiment: 'positive',
      impact: 'high'
    },
    {
      title: 'Tech Stocks Rally on Strong Earnings Reports',
      source: 'Wall Street Journal',
      time: '4 hours ago',
      url: '#',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      sentiment: 'positive',
      impact: 'medium'
    },
    {
      title: 'BIST100 Reaches New All-Time High',
      source: 'Bloomberg',
      time: '3 hours ago',
      url: '#',
      image: 'https://images.unsplash.com/photo-1582486225644-dce7c7d85ff5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      sentiment: 'positive',
      impact: 'high'
    },
    {
      title: 'Turkish Banking Sector Shows Strong Growth',
      source: 'Reuters',
      time: '5 hours ago',
      url: '#',
      image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80',
      sentiment: 'positive',
      impact: 'medium'
    },
    {
      title: 'Global Markets React to Economic Data',
      source: 'CNBC',
      time: '6 hours ago',
      url: '#',
      image: 'https://images.unsplash.com/photo-1642543348745-03b1219733d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80',
      sentiment: 'neutral',
      impact: 'medium'
    }
  ];
};