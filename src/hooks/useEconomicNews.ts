import { useState, useEffect, useCallback } from 'react';
import { fetchEconomicNews, analyzeNewsImpact } from '../services/finnhub';
import { popularStocks } from '../utils/mockData'; // For demo purposes

export interface EconomicNewsItem {
  id: string;
  headline: string;
  summary: string;
  url: string;
  source: string;
  datetime: number;
  image?: string;
  isMarketWide: boolean;
  affectedSectors: string[];
  mentionedSymbols: string[];
  portfolioMentioned: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  impactLevel: 'high' | 'medium' | 'low';
}

export interface UseEconomicNewsResult {
  news: EconomicNewsItem[];
  loading: boolean;
  error: string | null;
  refreshNews: () => Promise<void>;
  filterByPortfolioImpact: (showPortfolioOnly: boolean) => void;
  filterBySector: (sector: string | null) => void;
  filterByImpactLevel: (level: 'high' | 'medium' | 'low' | null) => void;
}

export const useEconomicNews = (): UseEconomicNewsResult => {
  const [news, setNews] = useState<EconomicNewsItem[]>([]);
  const [allNews, setAllNews] = useState<EconomicNewsItem[]>([]); // Keep a copy of all news for filtering
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPortfolioOnly, setShowPortfolioOnly] = useState<boolean>(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedImpactLevel, setSelectedImpactLevel] = useState<'high' | 'medium' | 'low' | null>(null);

  // For demo purposes, we'll use popularStocks as the user's portfolio
  // In a real app, this would be fetched from a user's account
  const userPortfolioSymbols = popularStocks.slice(0, 5).map(stock => stock.symbol);

  // Function to fetch news
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchEconomicNews();
      
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      
      // Process and analyze each news item
      const processedNews = result.news.map((item: any) => {
        const impact = analyzeNewsImpact(item, userPortfolioSymbols);
        
        return {
          id: item.id || `news-${item.datetime}`,
          headline: item.headline,
          summary: item.summary || 'No summary available',
          url: item.url,
          source: item.source,
          datetime: item.datetime * 1000, // Convert to milliseconds if needed
          image: item.image,
          isMarketWide: impact.isMarketWide,
          affectedSectors: impact.affectedSectors,
          mentionedSymbols: impact.mentionedSymbols,
          portfolioMentioned: impact.portfolioMentioned,
          sentiment: impact.sentiment as 'positive' | 'negative' | 'neutral',
          impactLevel: impact.impactLevel as 'high' | 'medium' | 'low',
        };
      });
      
      // Sort by datetime (newest first)
      const sortedNews = processedNews.sort((a: EconomicNewsItem, b: EconomicNewsItem) => 
        b.datetime - a.datetime
      );
      
      setAllNews(sortedNews);
      setNews(sortedNews);
    } catch (err) {
      setError('Failed to fetch economic news');
      console.error('Error in fetchNews:', err);
    } finally {
      setLoading(false);
    }
  }, [userPortfolioSymbols]);
  
  // Apply all current filters
  const applyFilters = useCallback(() => {
    let filteredNews = [...allNews];
    
    // Filter by portfolio impact
    if (showPortfolioOnly) {
      filteredNews = filteredNews.filter(item => 
        item.portfolioMentioned.length > 0 || 
        (item.isMarketWide && userPortfolioSymbols.length > 0)
      );
    }
    
    // Filter by sector
    if (selectedSector) {
      filteredNews = filteredNews.filter(item => 
        item.affectedSectors.includes(selectedSector)
      );
    }
    
    // Filter by impact level
    if (selectedImpactLevel) {
      filteredNews = filteredNews.filter(item => 
        item.impactLevel === selectedImpactLevel
      );
    }
    
    setNews(filteredNews);
  }, [allNews, showPortfolioOnly, selectedSector, selectedImpactLevel, userPortfolioSymbols]);
  
  // Filter functions
  const filterByPortfolioImpact = useCallback((value: boolean) => {
    setShowPortfolioOnly(value);
  }, []);
  
  const filterBySector = useCallback((sector: string | null) => {
    setSelectedSector(sector);
  }, []);
  
  const filterByImpactLevel = useCallback((level: 'high' | 'medium' | 'low' | null) => {
    setSelectedImpactLevel(level);
  }, []);
  
  // Apply filters when filter settings change
  useEffect(() => {
    applyFilters();
  }, [applyFilters, showPortfolioOnly, selectedSector, selectedImpactLevel]);
  
  // Initial fetch
  useEffect(() => {
    fetchNews();
    
    // Set up polling - refresh every 30 minutes
    const intervalId = setInterval(() => {
      fetchNews();
    }, 30 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchNews]);
  
  // Function to manually refresh
  const refreshNews = useCallback(async () => {
    await fetchNews();
  }, [fetchNews]);
  
  return {
    news,
    loading,
    error,
    refreshNews,
    filterByPortfolioImpact,
    filterBySector,
    filterByImpactLevel
  };
}; 