import { useEffect, useCallback } from 'react';
import { useStocks } from '../context/StockContext';

// Custom hook for stock-related pages to ensure they handle market status correctly
export const useStockPageData = () => {
  const { 
    nasdaqStocks, 
    bistStocks, 
    loading, 
    error, 
    marketStatus,
    refreshData,
    lastUpdated
  } = useStocks();

  // Set up auto-refresh when market is open
  useEffect(() => {
    // Don't set up interval if market status is not yet determined
    if (marketStatus.isOpen === null) return;
    
    let intervalId: NodeJS.Timeout | null = null;
    
    if (marketStatus.isOpen) {
      // Set up 30-second interval for updates when market is open
      intervalId = setInterval(() => {
        refreshData();
      }, 30000); // 30 seconds
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [marketStatus.isOpen, refreshData]);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  // Common utility functions that might be needed across pages
  const getPriceTypeMessage = useCallback(() => {
    if (marketStatus.loading) return 'Loading market status...';
    if (marketStatus.isOpen) return 'Real-time price';
    return 'Last closing price';
  }, [marketStatus.loading, marketStatus.isOpen]);

  const getRefreshPolicyMessage = useCallback(() => {
    if (marketStatus.loading) return 'Determining refresh policy...';
    if (marketStatus.isOpen) return 'Auto-refreshes every 30 seconds';
    if (marketStatus.holiday) return `No auto-refresh (Holiday: ${marketStatus.holiday})`;
    return 'Will auto-refresh when market opens';
  }, [marketStatus.loading, marketStatus.isOpen, marketStatus.holiday]);

  return {
    // Original stock context data
    nasdaqStocks,
    bistStocks,
    loading,
    error,
    marketStatus,
    lastUpdated,
    
    // Additional utility functions
    handleRefresh,
    getPriceTypeMessage,
    getRefreshPolicyMessage
  };
}; 