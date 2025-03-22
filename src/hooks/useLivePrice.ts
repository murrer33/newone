// useLivePrice.tsx
import { useState, useEffect, useCallback } from "react";
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
  const [cleanup, setCleanup] = useState<(() => void) | null>(null);

  const setupLivePrices = useCallback(() => {
    setLoading(true);
    setError(null);
    
    // Clean up previous connection if exists
    if (cleanup) {
      cleanup();
    }
    
    try {
      const cleanupFn = listenToLivePrices(symbols, (data: PriceData) => {
        setPrices((prev) => ({ ...prev, [data.symbol]: data.price }));
        setPriceHistory((prev) => ({
          ...prev,
          [data.symbol]: [...(prev[data.symbol] || []), data].slice(-100),
        }));
        setLoading(false);
      });
      
      setCleanup(() => cleanupFn);
      return cleanupFn;
    } catch (err) {
      console.error("Error setting up live prices:", err);
      setError("Failed to connect to price feed");
      setLoading(false);
      return () => {};
    }
  }, [symbols.join(",")]);

  // Initial setup
  useEffect(() => {
    const cleanupFn = setupLivePrices();
    return () => cleanupFn();
  }, [setupLivePrices]);

  // Function to refresh prices
  const refreshPrices = useCallback(() => {
    setLoading(true);
    setupLivePrices();
  }, [setupLivePrices]);

  return { prices, priceHistory, loading, error, refreshPrices };
};
