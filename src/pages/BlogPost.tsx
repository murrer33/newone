import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

// Reuse the same BlogPost interface from Blog.tsx
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

// Mock blog data - would be imported from a shared data file in a real app
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Technical Indicators: Moving Averages Explained',
    excerpt: 'Learn how moving averages can help identify market trends and potential trading opportunities.',
    content: `
      <p>Moving averages are one of the most widely used technical indicators in financial markets. They smooth out price data to create a single flowing line, making it easier to identify the direction of the trend.</p>
      
      <h2>What Are Moving Averages?</h2>
      <p>A moving average is simply the average price of a security over a specific number of periods. As new data becomes available, the average "moves" by adding the new data and removing the oldest data point.</p>
      
      <p>The two most common types of moving averages are:</p>
      <ul>
        <li><strong>Simple Moving Average (SMA)</strong>: Calculates the average of a selected range of prices, usually closing prices, by the number of periods in that range.</li>
        <li><strong>Exponential Moving Average (EMA)</strong>: Gives more weight to recent prices, making it more responsive to new information.</li>
      </ul>
      
      <h2>How to Use Moving Averages</h2>
      <p>Moving averages can be used in several ways to enhance your trading strategy:</p>
      
      <h3>1. Trend Identification</h3>
      <p>The direction of the moving average indicates the trend. An upward-sloping moving average suggests an uptrend, while a downward-sloping moving average indicates a downtrend.</p>
      
      <h3>2. Support and Resistance</h3>
      <p>Moving averages often act as dynamic support or resistance levels. In an uptrend, the price might pull back to the moving average before continuing higher. In a downtrend, the price might rally to the moving average before continuing lower.</p>
      
      <h3>3. Crossover Signals</h3>
      <p>When a shorter-term moving average crosses above a longer-term moving average, it generates a bullish "golden cross" signal. Conversely, when a shorter-term moving average crosses below a longer-term moving average, it creates a bearish "death cross" signal.</p>
      
      <h3>4. Multiple Moving Averages</h3>
      <p>Some traders use multiple moving averages to identify the overall trend strength. If short, medium, and long-term moving averages are all trending in the same direction, it indicates a strong trend.</p>
      
      <h2>Common Moving Average Periods</h2>
      <p>While you can use any time period for moving averages, some of the most commonly used ones include:</p>
      <ul>
        <li><strong>10-day MA</strong>: Very responsive to price changes, useful for short-term trading</li>
        <li><strong>20-day MA</strong>: Popular for identifying the short-term trend</li>
        <li><strong>50-day MA</strong>: Medium-term trend indicator, widely followed</li>
        <li><strong>100-day MA</strong>: Intermediate-term trend indicator</li>
        <li><strong>200-day MA</strong>: Long-term trend indicator, often watched by institutional investors</li>
      </ul>
      
      <h2>Limitations of Moving Averages</h2>
      <p>While moving averages are valuable tools, they do have limitations:</p>
      <ul>
        <li>They are lagging indicators, meaning they can be slow to respond to rapid price changes</li>
        <li>They work best in trending markets and may generate false signals in ranging or choppy markets</li>
        <li>Different time periods can give conflicting signals</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Moving averages are versatile technical indicators that can help traders identify trends, determine support and resistance levels, and generate trading signals. By understanding how to use moving averages effectively, you can improve your trading decisions and potentially enhance your returns.</p>
      
      <p>Remember that no single indicator should be used in isolation. Consider combining moving averages with other technical indicators and fundamental analysis for a more comprehensive trading approach.</p>
    `,
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
    content: `
      <p>Artificial Intelligence (AI) is transforming many industries, and finance is no exception. The ability of AI to analyze vast amounts of data and identify patterns imperceptible to humans is changing how we predict stock prices and make investment decisions.</p>
      
      <h2>The Evolution of Stock Prediction</h2>
      <p>Traditionally, stock price predictions relied on fundamental analysis (studying financial statements and economic indicators) and technical analysis (analyzing historical price charts). While these methods remain valuable, AI offers a new dimension by processing enormous datasets and uncovering complex relationships.</p>
      
      <h2>How AI Enhances Stock Predictions</h2>
      
      <h3>1. Processing Unstructured Data</h3>
      <p>AI systems can analyze unstructured data that humans would find overwhelming, including:</p>
      <ul>
        <li>News articles and social media posts</li>
        <li>Earnings call transcripts</li>
        <li>Economic reports</li>
        <li>Satellite imagery of retail parking lots or oil reserves</li>
      </ul>
      
      <h3>2. Sentiment Analysis</h3>
      <p>Natural Language Processing (NLP) allows AI to gauge market sentiment by analyzing text from news sources, social media, and financial reports. This provides insights into how investors feel about a particular stock or the market as a whole.</p>
      
      <h3>3. Pattern Recognition</h3>
      <p>Machine learning algorithms excel at identifying patterns in historical market data that may predict future price movements. These patterns can be far more complex than traditional chart patterns used in technical analysis.</p>
      
      <h3>4. Alternative Data Analysis</h3>
      <p>AI can process alternative data sources such as credit card transactions, app downloads, or internet traffic to gain insights into company performance before official earnings reports.</p>
      
      <h2>AI-Powered Trading Strategies</h2>
      
      <h3>1. Algorithmic Trading</h3>
      <p>AI-powered algorithms can execute trades based on predetermined criteria, removing emotional biases and enabling faster reactions to market changes.</p>
      
      <h3>2. Deep Learning Models</h3>
      <p>Neural networks and deep learning models can process multiple inputs and identify non-linear relationships between various factors affecting stock prices.</p>
      
      <h3>3. Reinforcement Learning</h3>
      <p>Some advanced AI systems use reinforcement learning to improve their predictions over time, learning from past successes and failures.</p>
      
      <h2>Challenges and Limitations</h2>
      
      <h3>1. Market Complexity</h3>
      <p>Financial markets are influenced by countless factors, including human psychology, making them inherently difficult to predict, even for sophisticated AI systems.</p>
      
      <h3>2. Black Swan Events</h3>
      <p>Unpredictable events like global pandemics or sudden regulatory changes can dramatically impact markets in ways that historical data cannot anticipate.</p>
      
      <h3>3. Adaptation Issues</h3>
      <p>As more investors use similar AI models, the effectiveness of these models may decrease as the market adapts to their predictions.</p>
      
      <h2>The Future of AI in Stock Predictions</h2>
      <p>As AI technology continues to advance, we can expect:</p>
      <ul>
        <li>More sophisticated models that combine multiple approaches</li>
        <li>Greater accessibility of AI tools for retail investors</li>
        <li>Increased regulatory attention to algorithmic trading</li>
        <li>Novel applications like AI-based investment advisors</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>While AI offers powerful new tools for stock price prediction, it's not a magic solution. The most successful investment strategies will likely combine AI insights with human judgment, fundamental analysis, and risk management principles.</p>
      
      <p>For investors, understanding how AI is changing the landscape of stock prediction is increasingly important, whether you're leveraging these tools directly or competing in markets where others are using them.</p>
    `,
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
  }
];

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    setLoading(true);
    setTimeout(() => {
      const foundPost = blogPosts.find(post => post.slug === slug);
      setPost(foundPost || null);
      
      if (foundPost) {
        // Find related posts based on category or tags
        const related = blogPosts
          .filter(p => 
            p.id !== foundPost.id && (
              p.category === foundPost.category || 
              p.tags.some(tag => foundPost.tags.includes(tag))
            )
          )
          .slice(0, 3);
        setRelatedPosts(related);
      }
      
      setLoading(false);
      
      // Scroll to top when post changes
      window.scrollTo(0, 0);
    }, 500);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl text-gray-600">Loading article...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been moved.</p>
        <Link to="/blog" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back to blog link */}
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Blog
        </Link>
      </div>
      
      {/* Article header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-10 text-gray-500 text-sm">
            <div className="flex items-center">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="h-10 w-10 rounded-full mr-3"
              />
              <span className="font-medium text-gray-900">{post.author.name}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{post.date}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
        
        {/* Featured image */}
        <div className="mb-10">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-md"
          />
        </div>
        
        {/* Article content */}
        <div className="prose prose-blue prose-lg max-w-none">
          {/* Render HTML content safely */}
          <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </div>
        
        {/* Tags */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link 
                key={tag} 
                to={`/blog?tag=${tag}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                <Tag className="h-4 w-4 mr-1" />
                {tag}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Share and bookmark */}
        <div className="mt-8 flex justify-center space-x-6">
          <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </button>
          <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <Bookmark className="h-5 w-5 mr-2" />
            Save
          </button>
        </div>
        
        {/* Author bio */}
        <div className="mt-10 pt-10 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="h-24 w-24 rounded-full mb-4 sm:mb-0 sm:mr-6"
            />
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {post.author.name}
              </h3>
              <p className="text-gray-600 mb-4">
                Financial analyst with over 10 years of experience in the stock market. 
                Specializing in technical analysis and market trends.
              </p>
              <Link 
                to={`/author/${post.author.name.toLowerCase().replace(' ', '-')}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View all articles
              </Link>
            </div>
          </div>
        </div>
      </article>
      
      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <div className="bg-white shadow-sm py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform hover:shadow-lg">
                  <div className="relative">
                    <img 
                      src={relatedPost.imageUrl} 
                      alt={relatedPost.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 left-0 m-4">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {relatedPost.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{relatedPost.date}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{relatedPost.readTime}</span>
                    </div>
                    <Link to={`/blog/${relatedPost.slug}`} className="block">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-600">
                        {relatedPost.excerpt}
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation between articles */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <Link 
            to="/blog" 
            className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous Article
          </Link>
          
          <Link 
            to="/blog" 
            className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Next Article
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost; 