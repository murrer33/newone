// finnhub.ts
import axios from 'axios';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

export const fetchHistoricalData = async (symbol: string, from: number, to: number) => {
  try {
    if (!API_KEY) {
      throw new Error('Finnhub API key not found. Please set VITE_FINNHUB_API_KEY environment variable.');
    }

    const response = await axios.get(`${BASE_URL}/stock/candle`, {
      params: {
        symbol,
        from,
        to,
        resolution: 'D',
        token: API_KEY
      }
    });

    if (response.data.s === 'ok') {
      return response.data.t.map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        open: response.data.o[index],
        high: response.data.h[index],
        low: response.data.l[index],
        close: response.data.c[index],
        volume: response.data.v[index]
      }));
    } else {
      throw new Error(`Failed to fetch historical data: ${response.data.s}`);
    }
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 403) {
        throw new Error('Invalid or expired API key. Please check your Finnhub API key.');
      } else if (error.response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`API Error: ${error.response.data.error || error.message}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from Finnhub API. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Error setting up request: ${error.message}`);
    }
  }
};

export const listenToLivePrices = (
  symbols: string[],
  callback: (data: {
    symbol: string;
    price: number;
    timestamp: string;
  }) => void,
) => {
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
  
  if (!apiKey) {
    console.error("Finnhub API key not found. Please set VITE_FINNHUB_API_KEY environment variable.");
    return () => {};
  }

  const socket = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);

  socket.onopen = () => {
    console.log("WebSocket connected");
    symbols.forEach((symbol) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "subscribe", symbol }));
      }
    });
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "trade" && data.data) {
        data.data.forEach((trade: any) => {
          const symbol = trade.s;
          const price = trade.p;
          const timestamp = new Date().toISOString();
          callback({ symbol, price, timestamp });
        });
      } else if (data.type === "error") {
        console.error("WebSocket error message:", data.msg);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    // Attempt to reconnect after a delay
    setTimeout(() => {
      if (socket.readyState === WebSocket.CLOSED) {
        console.log("Attempting to reconnect WebSocket...");
        socket.close();
      }
    }, 5000);
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
    // Attempt to reconnect after a delay
    setTimeout(() => {
      if (socket.readyState === WebSocket.CLOSED) {
        console.log("Attempting to reconnect WebSocket...");
        socket.close();
      }
    }, 5000);
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
