import React, { useEffect, useState } from "react";

const mockInsights = [
  {
    title: "Daily Market Recap",
    content:
      "Today, the market saw strong gains in technology stocks, with AAPL, GOOGL, and TSLA leading the way. Investors reacted positively to earnings reports and macroeconomic data.",
  },
  {
    title: "What’s going on with AAPL?",
    content:
      "Apple Inc. surged 2.5% after reporting record iPhone sales and strong guidance for the next quarter. Analysts remain bullish on the stock.",
  },
  {
    title: "What’s going on with TSLA?",
    content:
      "Tesla Inc. gained 3% as the company announced new battery technology and expansion plans in Europe. Market sentiment remains positive.",
  },
];

const AIInsightsPage: React.FC = () => {
  const [insights, setInsights] = useState(mockInsights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder for real API integration
  useEffect(() => {
    // setLoading(true);
    // fetch('/api/ai-insights')
    //   .then(res => res.json())
    //   .then(data => {
    //     setInsights(data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setError('Failed to fetch AI insights');
    //     setLoading(false);
    //   });
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">AI-Generated Insights</h1>
      {loading && <div>Loading AI insights...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="space-y-6">
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{insight.title} <span className="text-xs text-blue-500 ml-2">AI-generated</span></h2>
              <p className="text-gray-700 dark:text-gray-200">{insight.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInsightsPage; 