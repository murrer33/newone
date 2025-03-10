import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLivePrice } from '../hooks/useLivePrice';

// Define the shape of the stock data
interface Stock {
  symbol: string;
  name: string;
  price: number;
}

// Define the shape of the context
interface StockContextType {
  nasdaqStocks: Stock[];
  bistStocks: Stock[];
  loading: boolean;
  error: string | null;
}

// Create the context
const StockContext = createContext<StockContextType>({
  nasdaqStocks: [],
  bistStocks: [],
  loading: false,
  error: null,
});

// Create a provider component
export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nasdaqStocks, setNasdaqStocks] = useState<Stock[]>([]);
  const [bistStocks, setBistStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded lists of NASDAQ and BIST stocks
  const nasdaqTop50 = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    // Add all 50 NASDAQ stocks...
  ];

  const bist100 = [
    { symbol: 'THYAO', name: 'Türkiye Hava Yolları' },
    { symbol: 'GARAN', name: 'Garanti Bankası' },
    { symbol: 'AKBNK', name: 'Akbank' },
    // Add all 100 BIST stocks...
  ];

  // Fetch real-time prices for all NASDAQ and BIST stocks
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch NASDAQ stock prices
        const updatedNasdaqStocks = await Promise.all(
          nasdaqTop50.map(async (stock) => {
            try {
              const { price } = useLivePrice(stock.symbol, 0); // No API key needed
              console.log(`Fetched price for ${stock.symbol}:`, price); // Log fetched price
              return { ...stock, price };
            } catch (err) {
              console.error(`Failed to fetch price for ${stock.symbol}:`, err);
              return { ...stock, price: 0 }; // Fallback price
            }
          })
        );

        // Fetch BIST stock prices
        const updatedBistStocks = await Promise.all(
          bist100.map(async (stock) => {
            try {
              const { price } = useLivePrice(stock.symbol, 0); // No API key needed
              console.log(`Fetched price for ${stock.symbol}:`, price); // Log fetched price
              return { ...stock, price };
            } catch (err) {
              console.error(`Failed to fetch price for ${stock.symbol}:`, err);
              return { ...stock, price: 0 }; // Fallback price
            }
          })
        );

        setNasdaqStocks(updatedNasdaqStocks);
        setBistStocks(updatedBistStocks);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch stock prices:', err);
        setError('Failed to fetch stock prices');
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return (
    <StockContext.Provider value={{ nasdaqStocks, bistStocks, loading, error }}>
      {children}
    </StockContext.Provider>
  );
};

// Custom hook to use the stock context
export const useStocks = () => useContext(StockContext); // Ensure this line exists
