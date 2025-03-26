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
