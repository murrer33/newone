import React from 'react';
import { BarChart, Brain, Globe, Shield } from 'lucide-react';

const features = [
  {
    icon: <Brain className="h-8 w-8 text-blue-500" />,
    title: 'AI-Powered Analysis',
    description: 'Our advanced AI algorithms analyze market data and trends to provide accurate predictions and insights.'
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-500" />,
    title: 'Global Market Coverage',
    description: 'Access real-time data and analysis for stocks, ETFs, and cryptocurrencies from markets worldwide.'
  },
  {
    icon: <BarChart className="h-8 w-8 text-blue-500" />,
    title: 'Advanced Technical Analysis',
    description: 'Comprehensive technical indicators and chart patterns to help you make informed trading decisions.'
  },
  {
    icon: <Shield className="h-8 w-8 text-blue-500" />,
    title: 'Secure & Reliable',
    description: 'Bank-level security measures to protect your data and investments, with 99.9% platform uptime.'
  }
];

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              About Finpulses.tech
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl">
              Empowering investors with AI-driven market insights and analysis
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            At Finpulses.tech, we're committed to democratizing access to sophisticated
            financial analysis tools. By combining cutting-edge AI technology with
            comprehensive market data, we help investors make more informed decisions
            and achieve their financial goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Values
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  Continuously pushing the boundaries of what's possible in financial
                  technology and analysis.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparency</h3>
                <p className="text-gray-600">
                  Providing clear, honest, and accurate information to help you make
                  informed decisions.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Reliability</h3>
                <p className="text-gray-600">
                  Delivering consistent, dependable service and analysis you can trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 