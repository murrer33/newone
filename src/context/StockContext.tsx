// stockcontext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLivePrice } from '../hooks/useLivePrice';

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

const nasdaqTop50 = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 0 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 0 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 0 },
];

const bist100 = [
  { symbol: 'THYAO', name: 'Türkiye Hava Yolları', price: 0 },
  { symbol: 'GARAN', name: 'Garanti Bankası', price: 0 },
  { symbol: 'AKBNK', name: 'Akbank', price: 0 },
];

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nasdaqStocks, setNasdaqStocks] = useState<Stock[]>(nasdaqTop50);
  const [bistStocks, setBistStocks] = useState<Stock[]>(bist100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allSymbols = [...nasdaqTop50, ...bist100].map((stock) => stock.symbol);
  const { prices } = useLivePrice(allSymbols);

  useEffect(() => {
    setLoading(true);
    setNasdaqStocks((prev) =>
      prev.map((stock) => ({
        ...stock,
        price: prices[stock.symbol] || stock.price,
      }))
    );
    setBistStocks((prev) =>
      prev.map((stock) => ({
        ...stock,
        price: prices[stock.symbol] || stock.price,
      }))
    );
    setLoading(false);
  }, [prices]);

  return (
    <StockContext.Provider value={{ nasdaqStocks, bistStocks, loading, error }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStocks = () => useContext(StockContext);
