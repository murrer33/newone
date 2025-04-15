import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'What is Finpulses.tech?',
    answer: 'Finpulses.tech is an AI-powered stock analysis platform that provides real-time market insights, technical analysis, and stock predictions to help investors make informed decisions.',
    category: 'General'
  },
  {
    question: 'How accurate are the AI predictions?',
    answer: 'Our AI model combines multiple data sources, technical indicators, and market sentiment analysis to provide predictions with high accuracy rates. In backtesting, our models have demonstrated up to 90% accuracy for short-term predictions. However, all investments carry risk, and past performance does not guarantee future results.',
    category: 'Technology'
  },
  {
    question: 'What subscription plans do you offer?',
    answer: 'We offer three subscription tiers: Basic ($9.99/mo), Plus ($19.99/mo), and Pro ($29.99/mo). Each plan provides different levels of access to our features, with the Pro plan offering unlimited access to all features including AI predictions, real-time market data, and advanced technical indicators.',
    category: 'Pricing'
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. There are no cancellation fees or hidden charges.',
    category: 'Pricing'
  },
  {
    question: 'How do I get started?',
    answer: 'Simply create an account, choose your subscription plan, and start exploring our platform. We offer a comprehensive onboarding process to help you get familiar with all our features. You can also try our demo to experience the platform before subscribing.',
    category: 'General'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards and debit cards through our secure payment processor, Stripe. We also support PayPal for select regions.',
    category: 'Pricing'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take security seriously. We use industry-standard encryption and security measures to protect your data and financial information. Our platform is fully GDPR compliant, and we never share your personal information with third parties without your explicit consent.',
    category: 'Security'
  },
  {
    question: 'Do you offer technical support?',
    answer: 'Yes, we provide technical support via email and live chat. Pro plan subscribers also get priority support with faster response times and dedicated support specialists.',
    category: 'Support'
  },
  {
    question: 'What technical indicators do you offer?',
    answer: 'We offer a comprehensive suite of technical indicators including Moving Averages (SMA, EMA, WMA), Oscillators (RSI, MACD, Stochastic), Volume Indicators, Bollinger Bands, Fibonacci Retracements, and more. The availability of specific indicators depends on your subscription plan.',
    category: 'Technology'
  },
  {
    question: 'Do you offer market data for international stocks?',
    answer: 'Yes, we provide market data for major international markets including US, European, and Asian exchanges. Pro users get access to a wider range of global markets and extended historical data.',
    category: 'Features'
  },
  {
    question: 'How do you handle sensitive financial information?',
    answer: 'We never store your complete financial or credit card information on our servers. All payment processing is handled securely by our payment processor (Stripe) with PCI-DSS compliance. We implement strict data access controls and regular security audits.',
    category: 'Security'
  },
  {
    question: 'Can I export data from the platform?',
    answer: 'Yes, Plus and Pro subscribers can export analysis data, charts, and reports in various formats including PDF, CSV, and Excel. This allows you to incorporate our analysis into your own research workflow.',
    category: 'Features'
  },
  {
    question: 'How often is market data updated?',
    answer: 'Basic plan members get end-of-day updates. Plus subscribers receive hourly updates during market hours. Pro subscribers enjoy real-time market data with updates as frequent as every minute for selected stocks.',
    category: 'Features'
  },
  {
    question: 'Do you have a mobile app?',
    answer: 'Yes, we offer mobile apps for both iOS and Android devices. Our mobile apps provide access to key features of the platform, including stock monitoring, alerts, and quick analysis views.',
    category: 'General'
  },
  {
    question: 'What happens to my data if I cancel my subscription?',
    answer: 'Your account data is retained for 30 days after cancellation, allowing you to easily restore your settings if you resubscribe. After this period, personal data is anonymized or deleted in accordance with our privacy policy.',
    category: 'Security'
  }
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(faqItems.map(item => item.category)))];

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // Filter items based on category and search query
  const filteredItems = faqItems
    .filter(item => activeCategory === 'All' || item.category === activeCategory)
    .filter(item => 
      searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Find answers to common questions about Finpulses.tech
          </p>
        </div>

        {/* Search box */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ items */}
        <div className="mt-12 space-y-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  className="w-full px-6 py-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => toggleItem(index)}
                  aria-expanded={openItems.includes(index)}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-lg font-medium text-gray-900 text-left">
                    {item.question}
                  </span>
                  <span className="ml-2 flex-shrink-0">
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    )}
                  </span>
                </button>
                {openItems.includes(index) && (
                  <div 
                    id={`faq-answer-${index}`} 
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600">{item.answer}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No results found. Try a different search term or category.</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base text-gray-600">
            Still have questions?{' '}
            <a
              href="/contact"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 