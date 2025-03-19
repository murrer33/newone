// StockContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLivePrice } from "../hooks/useLivePrice";
import { StockData } from "../types";

const StockContext = createContext<any>(null);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nasdaqStocks, setNasdaqStocks] = useState<StockData[]>([
    { symbol: "AAPL", name: "Apple Inc.", currentPrice: 150, change: 0, changePercent: 0, volume: 0, historicalData: [] },
    { symbol: "MSFT", name: "Microsoft Corporation", currentPrice: 300, change: 0, changePercent: 0, volume: 0, historicalData: [] },
    { symbol: "GOOGL", name: "Alphabet Inc.", currentPrice: 2800, change: 0, changePercent: 0, volume: 0, historicalData: [] },
  ]);
  const [bistStocks, setBistStocks] = useState<StockData[]>([
    { symbol: "THYAO", name: "Turkish Airlines", currentPrice: 135, change: 0, changePercent: 0, volume: 0, historicalData: [] },
    { symbol: "GARAN", name: "Garanti Bank", currentPrice: 45, change: 0, changePercent: 0, volume: 0, historicalData: [] },
  ]);
  const symbols = [...nasdaqStocks, ...bistStocks].map((stock) => stock.symbol);
  const { prices, loading, error } = useLivePrice(symbols);

  useEffect(() => {
    if (Object.keys(prices).length > 0) {
      setNasdaqStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          currentPrice: prices[stock.symbol] || stock.currentPrice,
        })),
      );
      setBistStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          currentPrice: prices[stock.symbol] || stock.currentPrice,
        })),
      );
    }
  }, [prices]);

  return (
    <StockContext.Provider value={{ nasdaqStocks, bistStocks, loading, error }}>
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
