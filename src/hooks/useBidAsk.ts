import { useState, useEffect, useCallback } from 'react';
import { fetchBidAskData, checkMarketStatus } from '../services/finnhub';

export interface BidAskData {
  symbol: string;
  bidPrice: number | null;
  askPrice: number | null;
  bidVolume: number | null;
  askVolume: number | null;
  spread: string | null;
  timestamp: string;
}

export interface BidAskHistoryItem extends BidAskData {}

export interface UseBidAskResult {
  currentData: BidAskData | null;
  historyData: BidAskHistoryItem[];
  loading: boolean;
  error: string | null;
  isMarketOpen: boolean | null;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
}

export const useBidAsk = (symbol: string): UseBidAskResult => {
  const [currentData, setCurrentData] = useState<BidAskData | null>(null);
  const [historyData, setHistoryData] = useState<BidAskHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarketOpen, setIsMarketOpen] = useState<boolean | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to fetch market status
  const fetchMarketStatus = useCallback(async () => {
    try {
      const status = await checkMarketStatus();
      setIsMarketOpen(status.isOpen);
      if (status.error) {
        console.warn('Market status check warning:', status.error);
      }
    } catch (err) {
      console.error('Error checking market status:', err);
      // Don't set error state here, as we don't want to prevent bid/ask data from loading
    }
  }, []);

  // Function to fetch bid/ask data
  const fetchData = useCallback(async () => {
    if (!symbol) return;
    
    setLoading(true);
    
    try {
      const result = await fetchBidAskData(symbol);
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      const newData = {
        symbol: result.symbol,
        bidPrice: result.bidPrice,
        askPrice: result.askPrice,
        bidVolume: result.bidVolume,
        askVolume: result.askVolume,
        spread: result.spread,
        timestamp: result.timestamp,
      };
      
      setCurrentData(newData);
      setHistoryData(prev => {
        // Only keep the last 50 data points to avoid performance issues
        const history = [...prev, newData];
        if (history.length > 50) {
          return history.slice(history.length - 50);
        }
        return history;
      });
      
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to fetch bid/ask data');
      console.error('Error fetching bid/ask data:', err);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  // Function to refresh data that can be called manually
  const refreshData = useCallback(async () => {
    await fetchMarketStatus();
    await fetchData();
  }, [fetchMarketStatus, fetchData]);

  // Initial data fetch and setup interval for polling if market is open
  useEffect(() => {
    // Fetch initial data
    refreshData();
    
    // Set up polling if market is open
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isMarketOpen) {
      intervalId = setInterval(() => {
        fetchData();
      }, 10000); // Poll every 10 seconds when market is open
    }
    
    // Clean up interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [symbol, isMarketOpen, refreshData, fetchData]);

  return {
    currentData,
    historyData,
    loading,
    error,
    isMarketOpen,
    lastUpdated,
    refreshData
  };
}; 