// StockContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLivePrice } from "../hooks/useLivePrice";
import { Stock } from "../types";

const StockContext = createContext<any>(null);

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
  const { prices, loading, error } = useLivePrice(symbols);

  useEffect(() => {
    if (Object.keys(prices).length > 0) {
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
