// finnhub.ts
export const listenToLivePrices = (
  symbols: string[],
  callback: (data: {
    symbol: string;
    price: number;
    timestamp: string;
  }) => void,
) => {
  const apiKey = "cv85kmpr01qqdqh408n0cv85kmpr01qqdqh408ng"; //Defined here
  const socket = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`); // Line 11

  socket.onopen = () => {
    console.log("WebSocket connected");
    symbols.forEach((symbol) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "subscribe", symbol }));
      }
    });
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "trade" && data.data) {
      data.data.forEach((trade: any) => {
        const symbol = trade.s;
        const price = trade.p;
        const timestamp = new Date().toISOString();
        callback({ symbol, price, timestamp });
      });
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };

  return () => {
    if (socket.readyState === WebSocket.OPEN) {
      symbols.forEach((symbol) => {
        socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
      });
    }
    if (
      socket.readyState !== WebSocket.CLOSED &&
      socket.readyState !== WebSocket.CLOSING
    ) {
      socket.close();
    }
  };
};

// Function to check if the market is open
export const checkMarketStatus = async () => {
  const apiKey = "cv85kmpr01qqdqh408n0cv85kmpr01qqdqh408ng";
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${apiKey}`
    );
    const data = await response.json();
    return {
      isOpen: data.isOpen,
      holiday: data.holiday || null,
      error: null
    };
  } catch (error) {
    console.error('Error checking market status:', error);
    return {
      isOpen: null, // null when we don't know the status
      holiday: null,
      error: 'Failed to fetch market status'
    };
  }
};

// Function to fetch the last closing price
export const fetchLastClosingPrice = async (symbol: string) => {
  const apiKey = "cv85kmpr01qqdqh408n0cv85kmpr01qqdqh408ng";
  try {
    // Get stock candles for the last 2 days to make sure we have the latest closing price
    const to = Math.floor(Date.now() / 1000);
    const from = to - 172800; // 48 hours in seconds
    
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${apiKey}`
    );
    const data = await response.json();
    
    if (data.s === 'ok' && data.c && data.c.length > 0) {
      // Return the most recent closing price
      return {
        price: data.c[data.c.length - 1],
        error: null
      };
    } else {
      return {
        price: null,
        error: 'No closing price data available'
      };
    }
  } catch (error) {
    console.error(`Error fetching last closing price for ${symbol}:`, error);
    return {
      price: null,
      error: 'Failed to fetch closing price'
    };
  }
};

// Function to fetch bid and ask data for a stock symbol
export const fetchBidAskData = async (symbol: string) => {
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY || "cv85kmpr01qqdqh408n0cv85kmpr01qqdqh408ng";
  
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      symbol,
      bidPrice: data.b || null,
      askPrice: data.a || null,
      bidVolume: null, // Finnhub API doesn't provide bid/ask volume directly in the quote endpoint
      askVolume: null,
      spread: data.a && data.b ? (data.a - data.b).toFixed(2) : null,
      timestamp: new Date().toISOString(),
      error: null
    };
  } catch (error) {
    console.error(`Error fetching bid-ask data for ${symbol}:`, error);
    return {
      symbol,
      bidPrice: null,
      askPrice: null,
      bidVolume: null,
      askVolume: null,
      spread: null,
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch bid-ask data'
    };
  }
};

// Function to fetch economic news from Finnhub API
export const fetchEconomicNews = async (from?: string, to?: string) => {
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY || "cv85kmpr01qqdqh408n0cv85kmpr01qqdqh408ng";
  
  // Default date range - last 7 days if not specified
  const toDate = to || new Date().toISOString().split('T')[0];
  const fromDate = from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  try {
    // Fetch general market news with a focus on economic category
    const response = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const allNews = await response.json();
    
    // Filter for economic news only - looking for keywords in headlines or summary
    const economicKeywords = [
      'inflation', 'interest rate', 'federal reserve', 'fed', 
      'gdp', 'economic growth', 'recession', 'economy', 
      'unemployment', 'jobs report', 'treasury', 'fiscal policy', 
      'monetary policy', 'central bank', 'deficit', 'economic data', 
      'market impact', 'economic forecast', 'consumer spending', 'cpi',
      'ppi', 'economic outlook', 'fomc'
    ];
    
    const economicNews = allNews.filter((news: any) => {
      const headline = news.headline.toLowerCase();
      const summary = (news.summary || '').toLowerCase();
      
      return economicKeywords.some(keyword => 
        headline.includes(keyword) || summary.includes(keyword)
      );
    });
    
    return {
      news: economicNews,
      error: null
    };
  } catch (error) {
    console.error('Error fetching economic news:', error);
    return {
      news: [],
      error: 'Failed to fetch economic news'
    };
  }
};

// Function to analyze news sentiment and affected sectors/stocks
export const analyzeNewsImpact = (newsItem: any, userPortfolioSymbols: string[] = []) => {
  // Common sector keywords to identify affected sectors
  const sectorKeywords = {
    'technology': ['tech', 'software', 'hardware', 'semiconductor', 'cloud', 'digital', 'ai', 'artificial intelligence'],
    'finance': ['bank', 'finance', 'credit', 'loan', 'mortgage', 'interest rate', 'fed', 'federal reserve'],
    'healthcare': ['health', 'pharma', 'medical', 'biotech', 'drug', 'vaccine', 'therapeutic'],
    'energy': ['oil', 'gas', 'energy', 'renewable', 'solar', 'wind', 'petroleum', 'crude'],
    'consumer': ['retail', 'consumer', 'shopping', 'e-commerce', 'goods', 'spending'],
    'industrial': ['manufacturing', 'industrial', 'machinery', 'material', 'construction'],
    'utilities': ['utility', 'utilities', 'water', 'electricity', 'power'],
    'real estate': ['real estate', 'property', 'housing', 'home', 'mortgage', 'reit'],
  };
  
  // Market-wide impact keywords
  const marketWideKeywords = [
    'market', 'economy', 'recession', 'inflation', 'federal reserve', 
    'interest rate', 'gdp', 'economic outlook', 'global economy', 'fed',
    'fomc', 'monetary policy', 'fiscal policy', 'treasury'
  ];
  
  const headline = (newsItem.headline || '').toLowerCase();
  const summary = (newsItem.summary || '').toLowerCase();
  const content = headline + ' ' + summary;
  
  // Determine market-wide impact
  const isMarketWide = marketWideKeywords.some(keyword => content.includes(keyword));
  
  // Find affected sectors
  const affectedSectors = Object.entries(sectorKeywords)
    .filter(([sector, keywords]) => 
      keywords.some(keyword => content.includes(keyword))
    )
    .map(([sector]) => sector);
  
  // Extract mentioned stock symbols - look for capital letters surrounded by spaces
  // This is a simple heuristic and might not catch all stock symbols
  const mentionedSymbols: string[] = [];
  
  // Common stock symbol patterns (uppercase letters 1-5 chars)
  const symbolRegex = /\b[A-Z]{1,5}\b/g;
  const potentialSymbols = content.match(symbolRegex) || [];
  
  // Filter out common words that might be mistaken for symbols
  const commonAbbreviations = ['CEO', 'CFO', 'COO', 'CTO', 'US', 'USA', 'UK', 'EU', 'GDP'];
  
  for (const symbol of potentialSymbols) {
    if (!commonAbbreviations.includes(symbol)) {
      mentionedSymbols.push(symbol);
    }
  }
  
  // Check if any of the user's portfolio stocks are mentioned
  const portfolioMentioned = userPortfolioSymbols.filter(symbol => 
    mentionedSymbols.includes(symbol)
  );
  
  // Simple sentiment analysis
  const positiveKeywords = ['growth', 'increase', 'positive', 'improve', 'recovery', 'gain', 'rose', 'up', 'surge', 'rally'];
  const negativeKeywords = ['decline', 'decrease', 'negative', 'worsen', 'recession', 'loss', 'fell', 'down', 'drop', 'plunge', 'crisis'];
  
  const positiveScore = positiveKeywords.filter(word => content.includes(word)).length;
  const negativeScore = negativeKeywords.filter(word => content.includes(word)).length;
  
  let sentiment;
  if (positiveScore > negativeScore + 1) {
    sentiment = 'positive';
  } else if (negativeScore > positiveScore + 1) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  // Determine impact level
  let impactLevel;
  
  if (isMarketWide || affectedSectors.length > 2) {
    impactLevel = 'high';
  } else if (affectedSectors.length > 0 || mentionedSymbols.length > 0) {
    impactLevel = 'medium';
  } else {
    impactLevel = 'low';
  }
  
  return {
    isMarketWide,
    affectedSectors,
    mentionedSymbols,
    portfolioMentioned,
    sentiment,
    impactLevel
  };
};
