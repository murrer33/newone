// StockContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLivePrice } from "../hooks/useLivePrice";
import { useMarketStatus } from "../hooks/useMarketStatus";
import { useClosingPrices } from "../hooks/useClosingPrices";
import { Stock } from "../types";

// Define the context type
interface StockContextType {
  nasdaqStocks: Stock[];
  bistStocks: Stock[];
  loading: boolean;
  error: string | null;
  marketStatus: {
    isOpen: boolean | null;
    holiday: string | null;
    loading: boolean;
    error: string | null;
  };
}

const StockContext = createContext<StockContextType | null>(null);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nasdaqStocks, setNasdaqStocks] = useState<Stock[]>([
    { symbol: "AAPL", name: "Apple Inc.", price: 150 },
    { symbol: "MSFT", name: "Microsoft Corporation", price: 300 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 2800 },
  ]);
  const [bistStocks, setBistStocks] = useState<Stock[]>([
    { symbol: "THYAO", name: "Turkish Airlines", price: 135 },
    { symbol: "GARAN", name: "Garanti Bank", price: 45 },
  ]);
  
  const symbols = [...nasdaqStocks, ...bistStocks].map((stock) => stock.symbol);
  const { prices, loading: livePriceLoading, error: livePriceError } = useLivePrice(symbols);
  const marketStatus = useMarketStatus();
  const { closingPrices, loading: closingPriceLoading } = useClosingPrices(symbols);
  
  const loading = livePriceLoading || closingPriceLoading || marketStatus.loading;
  const error = livePriceError || marketStatus.error;

  useEffect(() => {
    // If market is open and we have live prices, use them
    if (marketStatus.isOpen && Object.keys(prices).length > 0) {
      setNasdaqStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          price: prices[stock.symbol] || stock.price,
        })),
      );
      setBistStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          price: prices[stock.symbol] || stock.price,
        })),
      );
    } 
    // If market is closed and we have closing prices, use them
    else if (marketStatus.isOpen === false && Object.keys(closingPrices).length > 0) {
      setNasdaqStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          price: closingPrices[stock.symbol] || stock.price,
        })),
      );
      setBistStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          price: closingPrices[stock.symbol] || stock.price,
        })),
      );
    }
    // If market status is unknown, still try to use live prices if available
    else if (Object.keys(prices).length > 0) {
      setNasdaqStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          price: prices[stock.symbol] || stock.price,
        })),
      );
      setBistStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          price: prices[stock.symbol] || stock.price,
        })),
      );
    }
  }, [prices, closingPrices, marketStatus.isOpen]);

  return (
    <StockContext.Provider value={{ nasdaqStocks, bistStocks, loading, error, marketStatus }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStocks = () => {
  const context = useContext(StockContext);
  if (!context)
    throw new Error("useStocks must be used within a StockProvider");
  return context;
};
