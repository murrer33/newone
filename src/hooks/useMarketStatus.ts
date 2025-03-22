import { useState, useEffect } from 'react';
import { checkMarketStatus } from '../services/finnhub';

interface MarketStatusState {
  isOpen: boolean | null;
  holiday: string | null;
  loading: boolean;
  error: string | null;
}

export const useMarketStatus = () => {
  const [marketStatus, setMarketStatus] = useState<MarketStatusState>({
    isOpen: null,
    holiday: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const status = await checkMarketStatus();
        setMarketStatus({
          isOpen: status.isOpen,
          holiday: status.holiday,
          loading: false,
          error: status.error
        });
      } catch (error) {
        setMarketStatus({
          isOpen: null,
          holiday: null,
          loading: false,
          error: 'Failed to fetch market status'
        });
      }
    };

    fetchMarketStatus();

    // Refresh market status every 5 minutes
    const intervalId = setInterval(fetchMarketStatus, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return marketStatus;
}; 