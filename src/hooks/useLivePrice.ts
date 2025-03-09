import { useState, useEffect } from 'react';
import { simulateLivePrices } from '../services/socket';

export const useLivePrice = (initialPrice: number) => {
  const [price, setPrice] = useState(initialPrice);
  const [priceHistory, setPriceHistory] = useState<{ price: number; timestamp: string }[]>([]);
  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);

  useEffect(() => {
    const startPrice = initialPrice;
    
    const cleanup = simulateLivePrices((data) => {
      setPrice(prev => {
        const newPrice = +(prev + data.price).toFixed(2);
        const priceChange = +(newPrice - startPrice).toFixed(2);
        const priceChangePercent = +((priceChange / startPrice) * 100).toFixed(2);
        
        setChange(priceChange);
        setChangePercent(priceChangePercent);
        
        setPriceHistory(prev => [...prev, { price: newPrice, timestamp: data.timestamp }].slice(-100));
        
        return newPrice;
      });
    });

    return () => cleanup();
  }, [initialPrice]);

  return { price, change, changePercent, priceHistory };
};