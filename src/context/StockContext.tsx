import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLivePrice } from '../hooks/useLivePrice';

// Define stock interfaces
interface Stock {
  symbol: string;
  name: string;
  price: number;
}

interface StockContextType {
  nasdaqStocks: Stock[];
  bistStocks: Stock[];
  loading: boolean;
  error: string | null;
}

const StockContext = createContext<StockContextType>({
  nasdaqStocks: [],
  bistStocks: [],
  loading: false,
  error: null,
});

// Hardcoded stock lists (for now)
const nasdaqTop50 = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 0 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 0 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 0 },
  // Add more...
];

const bist100 = [
  { symbol: 'THYAO', name: 'Türkiye Hava Yolları', price: 0 },
  { symbol: 'GARAN', name: 'Garanti Bankası', price: 0 },
  { symbol: 'AKBNK', name: 'Akbank', price: 0 },
  // Add more...
];

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nasdaqStocks, setNasdaqStocks] = useState<Stock[]>(nasdaqTop50);
  const [bistStocks, setBistStocks] = useState<Stock[]>(bist100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update stock prices dynamically
  const updateStockPrice = (symbol: string, price: number, stockList: Stock[], setStockList: (stocks: Stock[]) => void) => {
    setStockList((prev) =>
      prev.map((stock) =>
        stock.symbol === symbol ? { ...stock, price } : stock
      )
    );
  };

  // Use useLivePrice for each stock (example for NASDAQ)
  useEffect(() => {
    setLoading(true);
    const nasdaqCleanups: (() => void)[] = [];
    const bistCleanups: (() => void)[] = [];

    nasdaqTop50.forEach((stock) => {
      const { price } = useLivePrice(stock.symbol, stock.price);
      updateStockPrice(stock.symbol, price, nasdaqStocks, setNasdaqStocks);
    });

    bist100.forEach((stock) => {
      const { price } = useLivePrice(stock.symbol, stock.price);
      updateStockPrice(stock.symbol, price, bistStocks, setBistStocks);
    });

    setLoading(false);

    return () => {
      nasdaqCleanups.forEach((cleanup) => cleanup());
      bistCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <StockContext.Provider value={{ nasdaqStocks, bistStocks, loading, error }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStocks = () => useContext(StockContext);
