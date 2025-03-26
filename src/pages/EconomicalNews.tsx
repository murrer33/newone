import React, { useState } from 'react';
import { useEconomicNews } from '../hooks/useEconomicNews';
import EconomicNewsCard from '../components/EconomicNewsCard';
import MarketStatusHeader from '../components/MarketStatusHeader';
import DataLoadingPlaceholder from '../components/DataLoadingPlaceholder';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  Filter, 
  RefreshCw, 
  AlertTriangle
} from 'lucide-react';

const EconomicalNews: React.FC = () => {
  const { 
    news, 
    loading, 
    error, 
    refreshNews, 
    filterByPortfolioImpact, 
    filterBySector, 
    filterByImpactLevel 
  } = useEconomicNews();
  
  const [showPortfolioOnly, setShowPortfolioOnly] = useState<boolean>(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedImpactLevel, setSelectedImpactLevel] = useState<'high' | 'medium' | 'low' | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  
  // All available sectors from the data
  const availableSectors = [
    'technology', 'finance', 'healthcare', 'energy', 
    'consumer', 'industrial', 'utilities', 'real estate'
  ];
  
  // Handle portfolio filter change
  const handlePortfolioFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setShowPortfolioOnly(value);
    filterByPortfolioImpact(value);
  };
  
  // Handle sector filter change
  const handleSectorFilterChange = (sector: string | null) => {
    setSelectedSector(sector);
    filterBySector(sector);
  };
  
  // Handle impact level filter change
  const handleImpactLevelFilterChange = (level: 'high' | 'medium' | 'low' | null) => {
    setSelectedImpactLevel(level);
    filterByImpactLevel(level);
  };
  
  // Count market-wide impact news
  const marketWideCount = news.filter(item => item.isMarketWide).length;
  
  // Count news by sentiment
  const positiveSentimentCount = news.filter(item => item.sentiment === 'positive').length;
  const negativeSentimentCount = news.filter(item => item.sentiment === 'negative').length;
  const neutralSentimentCount = news.filter(item => item.sentiment === 'neutral').length;
  
  // Count news by impact level
  const highImpactCount = news.filter(item => item.impactLevel === 'high').length;
  const mediumImpactCount = news.filter(item => item.impactLevel === 'medium').length;
  const lowImpactCount = news.filter(item => item.impactLevel === 'low').length;
  
  // Last updated time
  const getLastUpdatedTime = () => {
    if (loading) return 'Updating...';
    return new Date().toLocaleTimeString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MarketStatusHeader
        title="Economic News Analysis"
        loading={loading}
        error={error}
        marketStatus={{
          isOpen: null,
          holiday: null,
          loading: false,
          error: null
        }}
        lastUpdated={new Date()}
        onRefresh={refreshNews}
      />
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Market Sentiment */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Market Sentiment</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm">Positive: {positiveSentimentCount}</span>
            </div>
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm">Neutral: {neutralSentimentCount}</span>
            </div>
            <div className="flex items-center">
              <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm">Negative: {negativeSentimentCount}</span>
            </div>
          </div>
        </div>
        
        {/* Impact Levels */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Impact Levels</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">High: {highImpactCount}</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-sm">Medium: {mediumImpactCount}</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Low: {lowImpactCount}</span>
            </div>
          </div>
        </div>
        
        {/* Market-Wide Impact */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Market-Wide Events</h3>
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <span className="text-sm">
              {marketWideCount} event{marketWideCount !== 1 ? 's' : ''} affecting the entire market
            </span>
          </div>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h3>
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center text-sm text-blue-500 hover:text-blue-700 transition-colors"
            >
              <Filter className="h-4 w-4 mr-1" />
              {showFilterMenu ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {showFilterMenu && (
            <div className="space-y-4">
              {/* Portfolio Filter */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPortfolioOnly}
                    onChange={handlePortfolioFilterChange}
                    className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Show only news affecting my portfolio
                  </span>
                </label>
              </div>
              
              {/* Sector Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Filter by Sector</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSectorFilterChange(null)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedSector === null 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    All
                  </button>
                  {availableSectors.map((sector) => (
                    <button
                      key={sector}
                      onClick={() => handleSectorFilterChange(sector)}
                      className={`px-3 py-1 text-xs rounded-full capitalize ${
                        selectedSector === sector 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Impact Level Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Filter by Impact</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleImpactLevelFilterChange(null)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedImpactLevel === null 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleImpactLevelFilterChange('high')}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedImpactLevel === 'high' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    High Impact
                  </button>
                  <button
                    onClick={() => handleImpactLevelFilterChange('medium')}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedImpactLevel === 'medium' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Medium Impact
                  </button>
                  <button
                    onClick={() => handleImpactLevelFilterChange('low')}
                    className={`px-3 py-1 text-xs rounded-full ${
                      selectedImpactLevel === 'low' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Low Impact
                  </button>
                </div>
              </div>
              
              {/* Clear Filters Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowPortfolioOnly(false);
                    setSelectedSector(null);
                    setSelectedImpactLevel(null);
                    filterByPortfolioImpact(false);
                    filterBySector(null);
                    filterByImpactLevel(null);
                  }}
                  className="px-3 py-1 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* News Section */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Latest Economic News
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-2">Last updated: {getLastUpdatedTime()}</span>
          <button 
            onClick={refreshNews}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      <DataLoadingPlaceholder
        isLoading={loading && news.length === 0}
        isEmpty={news.length === 0}
        loadingMessage="Loading economic news..."
        emptyMessage="No economic news found. Try adjusting your filters or check back later."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((newsItem) => (
            <EconomicNewsCard key={newsItem.id} news={newsItem} />
          ))}
        </div>
      </DataLoadingPlaceholder>
    </div>
  );
};

export default EconomicalNews; 