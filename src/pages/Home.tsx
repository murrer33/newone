import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Welcome to Stock Analysis App
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Your comprehensive platform for stock market analysis and technical indicators
      </p>
      <div className="space-y-4">
        <Link
          to="/dashboard"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Dashboard
        </Link>
        <p className="text-gray-500">
          Access real-time stock data, technical analysis, and market insights
        </p>
      </div>
    </div>
  );
};

export default Home; 