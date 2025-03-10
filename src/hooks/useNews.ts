import { useState, useEffect } from 'react';

const FINNHUB_API_KEY = 'cut0dn1r01qrsirjvtkgcut0dn1r01qrsirjvtl0'; // Replace with your Finnhub API key

interface NewsArticle {
  headline: string;
  summary: string;
  url: string;
  image?: string;
  source: string;
  datetime: number;
  impact?: 'positive' | 'negative' | 'neutral'; // Add impact field
}

export const useNews = (symbol: string) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`
        );
        const data = await response.json();

        // Transform the data into the expected format
        const formattedNews = data
          .map((article: any) => ({
            headline: article.headline,
            summary: article.summary,
            url: article.url,
            image: article.image,
            source: article.source,
            datetime: article.datetime,
            impact: getImpact(article.headline), // Determine impact based on headline
          }))
          .sort((a: NewsArticle, b: NewsArticle) => b.datetime - a.datetime) // Sort by date (newest first)
          .slice(0, 3); // Only show the 3 newest articles

        setNews(formattedNews);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news');
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);

  // Simple impact analysis based on keywords in the headline
  const getImpact = (headline: string): 'positive' | 'negative' | 'neutral' => {
    const positiveKeywords = ['up', 'rise', 'gain', 'positive', 'bullish'];
    const negativeKeywords = ['down', 'fall', 'drop', 'negative', 'bearish'];

    if (positiveKeywords.some((keyword) => headline.toLowerCase().includes(keyword))) {
      return 'positive';
    } else if (negativeKeywords.some((keyword) => headline.toLowerCase().includes(keyword))) {
      return 'negative';
    } else {
      return 'neutral';
    }
  };

  return { news, loading, error };
};
