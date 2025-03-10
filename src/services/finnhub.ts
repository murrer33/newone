import WebSocket from 'ws';

const FINNHUB_API_KEY = 'cut0dn1r01qrsirjvtkgcut0dn1r01qrsirjvtl0'; // Replace with your Finnhub API key
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export interface FinnhubQuote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  t: number;  // Timestamp
}

export interface FinnhubCandle {
  c: number[];  // Close prices
  h: number[];  // High prices
  l: number[];  // Low prices
  o: number[];  // Open prices
  s: string;    // Status
  t: number[];  // Timestamps
  v: number[];  // Volume data
}

class FinnhubAPI {
  private socket: WebSocket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    console.log('Connecting to Finnhub WebSocket...');
    this.socket = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection opened.');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data.toString());
        console.log('Received WebSocket message:', data);
        if (data.type === 'trade') {
          const symbol = data.data[0]?.s;
          if (symbol && this.subscribers.has(symbol)) {
            this.subscribers.get(symbol)?.forEach(callback => {
              callback({
                price: data.data[0].p,
                timestamp: new Date(data.data[0].t).toISOString(),
              });
            });
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed. Reconnecting...');
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  async getQuote(symbol: string): Promise<FinnhubQuote> {
    const response = await fetch(`${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    return response.json();
  }

  async getCandles(symbol: string, resolution: string, from: number, to: number): Promise<FinnhubCandle> {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );
    return response.json();
  }

  subscribeToSymbol(symbol: string, callback: (data: any) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'subscribe', symbol }));
      }
    }
    this.subscribers.get(symbol)?.add(callback);
  }

  unsubscribeFromSymbol(symbol: string, callback: (data: any) => void) {
    const symbolSubscribers = this.subscribers.get(symbol);
    if (symbolSubscribers) {
      symbolSubscribers.delete(callback);
      if (symbolSubscribers.size === 0) {
        this.subscribers.delete(symbol);
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
        }
      }
    }
  }
}

export const finnhubAPI = new FinnhubAPI();

// Export the subscribe and unsubscribe functions for use in hooks
export const listenToLivePrices = (symbol: string, callback: (data: { price: number; timestamp: string }) => void) => {
  finnhubAPI.subscribeToSymbol(symbol, callback);
  return () => finnhubAPI.unsubscribeFromSymbol(symbol, callback);
};
