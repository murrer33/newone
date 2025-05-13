import React, { useState, useEffect } from 'react';
import { Search, Clock, Calendar, Tag, User, ArrowRight, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  imageUrl: string;
  featured?: boolean;
  slug: string;
}

// Mock blog data
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Technical Indicators: Moving Averages Explained',
    excerpt: 'Learn how moving averages can help identify market trends and potential trading opportunities.',
    date: 'April 15, 2023',
    readTime: '8 min read',
    author: {
      name: 'Ayşe Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    category: 'Technical Analysis',
    tags: ['moving averages', 'technical indicators', 'trading strategies'],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    featured: true,
    slug: 'understanding-technical-indicators-moving-averages'
  },
  {
    id: '2',
    title: 'The Impact of AI on Stock Price Predictions',
    excerpt: 'Explore how artificial intelligence is revolutionizing stock price predictions and what it means for investors.',
    date: 'March 28, 2023',
    readTime: '6 min read',
    author: {
      name: 'Mehmet Kaya',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    category: 'AI & Technology',
    tags: ['AI', 'predictions', 'machine learning'],
    imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    featured: true,
    slug: 'impact-of-ai-on-stock-price-predictions'
  },
  {
    id: '3',
    title: 'Fundamental Analysis: Reading Financial Statements',
    excerpt: 'A comprehensive guide to understanding financial statements and using them for stock valuation.',
    date: 'March 15, 2023',
    readTime: '10 min read',
    author: {
      name: 'Zeynep Demir',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    category: 'Fundamental Analysis',
    tags: ['financial statements', 'valuation', 'investing'],
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    slug: 'fundamental-analysis-reading-financial-statements'
  },
  {
    id: '4',
    title: 'Navigating Bear Markets: Strategies for Tough Times',
    excerpt: 'Learn how to protect your investments and find opportunities during market downturns.',
    date: 'February 22, 2023',
    readTime: '7 min read',
    author: {
      name: 'Ahmet Yıldız',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    category: 'Market Strategy',
    tags: ['bear market', 'risk management', 'investing'],
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    slug: 'navigating-bear-markets'
  },
  {
    id: '5',
    title: 'Sentiment Analysis: How Market Emotions Affect Stock Prices',
    excerpt: 'Discover how investor sentiment can drive market movements and how to measure it effectively.',
    date: 'February 10, 2023',
    readTime: '5 min read',
    author: {
      name: 'Elif Şahin',
      avatar: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    category: 'Sentiment Analysis',
    tags: ['sentiment', 'market psychology', 'indicators'],
    imageUrl: 'https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    slug: 'sentiment-analysis-market-emotions'
  },
  {
    id: '6',
    title: 'Building a Diversified Portfolio: Asset Allocation Strategies',
    excerpt: 'Learn the principles of effective asset allocation to build a resilient investment portfolio.',
    date: 'January 25, 2023',
    readTime: '9 min read',
    author: {
      name: 'Berk Özkan',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    category: 'Portfolio Management',
    tags: ['diversification', 'asset allocation', 'risk management'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    slug: 'building-diversified-portfolio'
  },
  {
    id: '7',
    title: 'Cryptocurrency and Traditional Markets: Understanding the Correlation',
    excerpt: 'Examine the evolving relationship between cryptocurrency and traditional financial markets.',
    date: 'January 12, 2023',
    readTime: '7 min read',
    author: {
      name: 'Ayşe Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    category: 'Cryptocurrency',
    tags: ['crypto', 'correlation', 'diversification'],
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    slug: 'cryptocurrency-traditional-markets-correlation'
  },
  {
    id: '8',
    title: 'ESG Investing: Financial Performance and Social Impact',
    excerpt: 'Investigate whether ESG investing can deliver both competitive returns and positive social outcomes.',
    date: 'December 18, 2022',
    readTime: '8 min read',
    author: {
      name: 'Mehmet Kaya',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    category: 'ESG Investing',
    tags: ['ESG', 'sustainable investing', 'performance'],
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    slug: 'esg-investing-performance-social-impact'
  }
];

// Get unique categories from blog posts
const allCategories = Array.from(new Set(blogPosts.map(post => post.category)));

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const { user } = useAuth();

  // Filter posts based on search query and selected category
  useEffect(() => {
    let result = blogPosts;
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        post.excerpt.toLowerCase().includes(lowerCaseQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
        post.category.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    if (selectedCategory) {
      result = result.filter(post => post.category === selectedCategory);
    }
    
    setFilteredPosts(result);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Financial Insights Blog
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
              Expert analysis, market trends, and investment strategies to help you make informed decisions.
            </p>
            
            {user && (
              <div className="mt-6 mb-8">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                >
                  <BarChart className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Link>
              </div>
            )}
            
            {/* Search Bar */}
            <div className="mt-12 max-w-xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-white bg-opacity-90 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm"
                  placeholder="Search articles, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 mx-1 text-sm font-medium rounded-md transition-colors
                ${selectedCategory === null 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              All
            </button>
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 mx-1 text-sm font-medium rounded-md transition-colors
                  ${selectedCategory === category 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      {!selectedCategory && !searchQuery && (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {blogPosts.filter(post => post.featured).map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform hover:shadow-lg">
                <div className="relative">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-0 left-0 m-4">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                  <Link to={`/blog/${post.slug}`} className="block">
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-600">
                      {post.excerpt}
                    </p>
                  </Link>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <span className="font-medium text-gray-900">{post.author.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Articles */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {searchQuery 
            ? `Search Results for "${searchQuery}"` 
            : selectedCategory 
              ? `${selectedCategory} Articles` 
              : 'Latest Articles'}
        </h2>
        
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No articles found. Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform hover:shadow-lg">
                <div className="relative">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 left-0 m-4">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                  <Link to={`/blog/${post.slug}`} className="block">
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-600">
                      {post.excerpt}
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              {user ? 'Ready to Return to Your Dashboard?' : 'Subscribe to Our Newsletter'}
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-200">
              {user 
                ? 'Go back to your dashboard to view your personalized market insights and analysis.' 
                : 'Get the latest financial insights and market analysis delivered to your inbox.'}
            </p>
            <div className="mt-8 sm:flex sm:justify-center">
              {user ? (
                <div className="rounded-md shadow">
                  <Link
                    to="/dashboard"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    <BarChart className="mr-2 h-5 w-5" />
                    Return to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="sm:flex-1 max-w-lg">
                  <form className="sm:flex">
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full sm:max-w-xs px-5 py-3 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
                      placeholder="Enter your email"
                    />
                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
                      >
                        Subscribe
                      </button>
                    </div>
                  </form>
                  <p className="mt-3 text-sm text-blue-200">
                    We care about your data. Read our{' '}
                    <a href="/privacy" className="font-medium text-white underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Topics</h2>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(blogPosts.flatMap(post => post.tags)))
            .slice(0, 12)
            .map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                <Tag className="h-4 w-4 mr-1" />
                {tag}
              </button>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Blog; 