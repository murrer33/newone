// useLivePrice.tsx
import { useState, useEffect } from "react";
import { listenToLivePrices } from "../services/finnhub.ts"; // Added .ts

interface PriceData {
  symbol: string;
  price: number;
  timestamp: string;
}

export const useLivePrice = (symbols: string[]) => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [priceHistory, setPriceHistory] = useState<Record<string, PriceData[]>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const cleanup = listenToLivePrices(symbols, (data: PriceData) => {
      setPrices((prev) => ({ ...prev, [data.symbol]: data.price }));
      setPriceHistory((prev) => ({
        ...prev,
        [data.symbol]: [...(prev[data.symbol] || []), data].slice(-100),
      }));
      setLoading(false);
    });

    return () => cleanup();
  }, [symbols.join(",")]);

  return { prices, priceHistory, loading, error };
};
