import { useState, useEffect } from 'react';

const FINNHUB_API_KEY = 'cv85kmpr01qqdqh408n0cv85kmpr01qqdqh408ng'; // Replace with your Finnhub API key

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
  const getImpact = (headline: string): 'high-positive' | 'positive' | 'neutral' | 'negative' | 'high-negative' => {
  const positiveKeywords = ['up', 'rise', 'gain', 'positive', 'bullish', 'surge', 'soar'];
  const negativeKeywords = ['down', 'fall', 'drop', 'negative', 'bearish', 'plunge', 'crash'];

  const positiveCount = positiveKeywords.filter((keyword) =>
    headline.toLowerCase().includes(keyword)
  ).length;
  const negativeCount = negativeKeywords.filter((keyword) =>
    headline.toLowerCase().includes(keyword)
  ).length;

  if (positiveCount > 2) {
    return 'high-positive';
  } else if (positiveCount > 0) {
    return 'positive';
  } else if (negativeCount > 2) {
    return 'high-negative';
  } else if (negativeCount > 0) {
    return 'negative';
  } else {
    return 'neutral';
  }
};

  return { news, loading, error };
};
