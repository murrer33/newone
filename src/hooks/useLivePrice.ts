import { useState, useEffect } from 'react';
import { listenToLivePrices } from '../services/finnhub';

interface PriceData {
  price: number;
  timestamp: string;
}

export const useLivePrice = (symbol: string, initialPrice: number) => {
  const [price, setPrice] = useState(initialPrice);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);

  useEffect(() => {
    const cleanup = listenToLivePrices(symbol, (data: PriceData) => {
      setPrice(data.price);
      setPriceHistory((prev) => [...prev, data].slice(-100)); // Keep last 100 prices
    });

    return () => cleanup();
  }, [symbol]);

  return { price, priceHistory };
};
