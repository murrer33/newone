import { useState, useEffect, useCallback } from 'react';
import { fetchLastClosingPrice } from '../services/finnhub';

interface ClosingPriceState {
  [symbol: string]: number | null;
}

interface ClosingPriceErrorState {
  [symbol: string]: string | null;
}

export const useClosingPrices = (symbols: string[]) => {
  const [closingPrices, setClosingPrices] = useState<ClosingPriceState>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<ClosingPriceErrorState>({});

  const fetchClosingPrices = useCallback(async () => {
    if (symbols.length === 0) return;
    
    setLoading(true);
    
    // Create a temporary object to store results
    const newClosingPrices: ClosingPriceState = {};
    const newErrors: ClosingPriceErrorState = {};
    
    // Fetch closing prices for all symbols
    const promises = symbols.map(async (symbol) => {
      try {
        const result = await fetchLastClosingPrice(symbol);
        newClosingPrices[symbol] = result.price;
        newErrors[symbol] = result.error;
      } catch (error) {
        newClosingPrices[symbol] = null;
        newErrors[symbol] = 'Failed to fetch closing price';
      }
    });
    
    await Promise.all(promises);
    
    setClosingPrices(newClosingPrices);
    setErrors(newErrors);
    setLoading(false);
  }, [symbols.join(',')]);

  // Initial fetch
  useEffect(() => {
    fetchClosingPrices();
  }, [fetchClosingPrices]);

  // Function to refresh closing prices
  const refreshClosingPrices = useCallback(() => {
    fetchClosingPrices();
  }, [fetchClosingPrices]);

  return { closingPrices, loading, errors, refreshClosingPrices };
}; 