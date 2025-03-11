// useLivePrice.tsx
import { useState, useEffect } from 'react';
import { listenToLivePrices } from '../services/finnhub';

interface PriceData {
  symbol: string;
  price: number;
  timestamp: string;
}

export const useLivePrice = (symbols: string[]) => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [priceHistory, setPriceHistory] = useState<Record<string, PriceData[]>>({});

  useEffect(() => {
    const cleanup = listenToLivePrices(symbols, (data: PriceData) => {
      setPrices((prev) => ({ ...prev, [data.symbol]: data.price }));
      setPriceHistory((prev) => ({
        ...prev,
        [data.symbol]: [...(prev[data.symbol] || []), data].slice(-100),
      }));
    });

    return () => cleanup();
  }, [symbols.join(',')]); // Re-run if symbols change

  return { prices, priceHistory };
};
