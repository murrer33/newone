import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchClosingPrices = async () => {
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
    };

    if (symbols.length > 0) {
      fetchClosingPrices();
    }
  }, [symbols.join(',')]);

  return { closingPrices, loading, errors };
}; 