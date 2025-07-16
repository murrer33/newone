import React from "react";
import SentimentChart from "../components/SentimentChart";
import SentimentAnalysisCard from "../components/SentimentAnalysisCard";
import { SentimentAnalysis, SocialMediaSentiment } from "../types/index";

const mockSentimentData: SentimentAnalysis[] = [
  {
    overall: 55,
    breakdown: [
      { platform: "twitter", sentiment: "positive", score: 60, volume: 120, change: 5 },
      { platform: "reddit", sentiment: "neutral", score: 30, volume: 80, change: 2 },
      { platform: "news", sentiment: "negative", score: 10, volume: 40, change: -3 },
    ] as SocialMediaSentiment[],
    trending: ["AAPL", "iPhone", "AppleEvent"]
  },
  {
    overall: 35,
    breakdown: [
      { platform: "twitter", sentiment: "positive", score: 50, volume: 100, change: 4 },
      { platform: "reddit", sentiment: "neutral", score: 40, volume: 60, change: 1 },
      { platform: "news", sentiment: "negative", score: 20, volume: 30, change: -2 },
    ] as SocialMediaSentiment[],
    trending: ["GOOGL", "AI", "Search"]
  },
  {
    overall: -10,
    breakdown: [
      { platform: "twitter", sentiment: "negative", score: 20, volume: 90, change: -5 },
      { platform: "reddit", sentiment: "neutral", score: 30, volume: 50, change: 0 },
      { platform: "news", sentiment: "negative", score: 5, volume: 20, change: -1 },
    ] as SocialMediaSentiment[],
    trending: ["TSLA", "Elon", "Recall"]
  },
];

const SentimentPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Social Sentiment Analysis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockSentimentData.map((data, idx) => (
          <SentimentAnalysisCard key={idx} data={data} />
        ))}
      </div>
      <div className="mt-10">
        {/* Show the breakdown for the first stock as a sample chart */}
        <SentimentChart data={mockSentimentData[0].breakdown} />
      </div>
    </div>
  );
};

export default SentimentPage; 