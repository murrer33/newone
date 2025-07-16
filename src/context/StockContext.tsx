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
  refreshData: () => void;
  lastUpdated: Date | null;
}

const StockContext = createContext<StockContextType | null>(null);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nasdaqStocks, setNasdaqStocks] = useState<Stock[]>([
    { symbol: "AAPL", name: "Apple Inc.", price: 150 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 2800 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 700 },
  ]);
  const [bistStocks, setBistStocks] = useState<Stock[]>([
    { symbol: "THYAO", name: "Turkish Airlines", price: 135 },
    { symbol: "GARAN", name: "Garanti Bank", price: 45 },
  ]);
  
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const symbols = [...nasdaqStocks, ...bistStocks].map((stock) => stock.symbol);
  const { prices, loading: livePriceLoading, error: livePriceError, refreshPrices } = useLivePrice(symbols);
  const marketStatus = useMarketStatus();
  const { closingPrices, loading: closingPriceLoading, errors: closingPriceErrors, refreshClosingPrices } = useClosingPrices(symbols);
  
  const loading = livePriceLoading || closingPriceLoading || marketStatus.loading;
  const error = livePriceError || marketStatus.error || 
    (Object.values(closingPriceErrors).some(err => err !== null) ? "Some closing prices failed to load" : null);

  // Function to refresh all data
  const refreshData = () => {
    if (marketStatus.isOpen) {
      refreshPrices();
    } else {
      refreshClosingPrices();
    }
    setLastUpdated(new Date());
  };

  // Auto-refresh every 30 seconds when market is open
  useEffect(() => {
    // Don't set up interval if market status is not yet determined
    if (marketStatus.isOpen === null) return;
    
    let intervalId: NodeJS.Timeout | null = null;
    
    if (marketStatus.isOpen) {
      // Set up 30-second interval for updates when market is open
      intervalId = setInterval(() => {
        refreshData();
      }, 30000); // 30 seconds
      
      // Initial refresh
      refreshData();
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [marketStatus.isOpen]);

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
      setLastUpdated(new Date());
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
      setLastUpdated(new Date());
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
      setLastUpdated(new Date());
    }
  }, [prices, closingPrices, marketStatus.isOpen]);

  return (
    <StockContext.Provider value={{ 
      nasdaqStocks, 
      bistStocks, 
      loading, 
      error, 
      marketStatus, 
      refreshData, 
      lastUpdated 
    }}>
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
