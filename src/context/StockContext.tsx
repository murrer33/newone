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
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.' },
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
    { symbol: 'V', name: 'Visa Inc.' },
    // Add the remaining 40 NASDAQ stocks...
  ];

  const bist100 = [
    { symbol: 'THYAO', name: 'Türkiye Hava Yolları' },
    { symbol: 'GARAN', name: 'Garanti Bankası' },
    { symbol: 'AKBNK', name: 'Akbank' },
    { symbol: 'ASELS', name: 'Aselsan Elektronik' },
    { symbol: 'KOZAA', name: 'Koza Altın' },
    { symbol: 'TCELL', name: 'Turkcell İletişim Hizmetleri' },
    { symbol: 'TUPRS', name: 'Tüpraş' },
    { symbol: 'SISE', name: 'Şişecam' },
    { symbol: 'KCHOL', name: 'Koç Holding' },
    { symbol: 'PETKM', name: 'Petkim Petrokimya Holding' },
    // Add the remaining 90 BIST stocks...
  ];

  // Fetch real-time prices for all NASDAQ and BIST stocks
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch NASDAQ stock prices
        const updatedNasdaqStocks = await Promise.all(
          nasdaqTop50.map(async (stock) => {
            const { price } = useLivePrice(stock.symbol, 0); // Assuming useLivePrice is a hook that fetches prices
            return { ...stock, price };
          })
        );

        // Fetch BIST stock prices
        const updatedBistStocks = await Promise.all(
          bist100.map(async (stock) => {
            const { price } = useLivePrice(stock.symbol, 0); // Assuming useLivePrice is a hook that fetches prices
            return { ...stock, price };
          })
        );

        setNasdaqStocks(updatedNasdaqStocks);
        setBistStocks(updatedBistStocks);
        setLoading(false);
      } catch (err) {
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
export const useStocks = () => useContext(StockContext);
