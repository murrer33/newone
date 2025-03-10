import { useState, useEffect } from 'react';
import { finnhubAPI } from '../services/finnhub';

export const useLivePrice = (symbol: string, initialPrice: number) => {
  const [price, setPrice] = useState(initialPrice);
  const [priceHistory, setPriceHistory] = useState<{ price: number; timestamp: string }[]>([]);
  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);

  useEffect(() => {
    // Get initial quote
    finnhubAPI.getQuote(symbol).then((quote) => {
      setPrice(quote.c);
      setChange(quote.d);
      setChangePercent(quote.dp);
    });

    // Subscribe to real-time updates
    const handleUpdate = (data: { price: number; timestamp: string }) => {
      setPrice(prev => {
        const newPrice = data.price;
        const priceChange = +(newPrice - initialPrice).toFixed(2);
        const priceChangePercent = +((priceChange / initialPrice) * 100).toFixed(2);
        
        setChange(priceChange);
        setChangePercent(priceChangePercent);
        
        setPriceHistory(prev => [...prev, { price: newPrice, timestamp: data.timestamp }].slice(-100));
        
        return newPrice;
      });
    };

    finnhubAPI.subscribeToSymbol(symbol, handleUpdate);

    return () => {
      finnhubAPI.unsubscribeFromSymbol(symbol, handleUpdate);
    };
  }, [symbol, initialPrice]);

  return { price, change, changePercent, priceHistory };
};
