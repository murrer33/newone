import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  ChevronDown, 
  ChevronUp,
  UserCheck,
  Plus,
  Info,
  Search,
  Filter
} from 'lucide-react';
import { 
  getForumPosts, 
  getCommentsForPost, 
  addCommentToPost, 
  createForumPost,
  isVerifiedAdvisor,
  ForumPost,
  ForumComment
} from '../services/forumService';
import { formatDistanceToNow } from 'date-fns';

const AdvisorForum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, ForumComment[]>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [isAdvisor, setIsAdvisor] = useState(false);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
    checkAdvisorStatus();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getForumPosts(page, 10, true);
      setPosts(response.posts);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error) {
      console.error('Error fetching advisor forum posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAdvisorStatus = async () => {
    try {
      const isVerified = await isVerifiedAdvisor();
      setIsAdvisor(isVerified);
    } catch (error) {
      console.error('Error checking advisor status:', error);
    }
  };

  const togglePostExpansion = async (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
      return;
    }
    
    setExpandedPost(postId);
    
    if (!comments[postId]) {
      try {
        const postComments = await getCommentsForPost(postId);
        setComments(prev => ({ ...prev, [postId]: postComments }));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!isAdvisor) {
      alert('Only verified financial advisors can comment in this forum');
      return;
    }
    
    if (!commentText[postId]?.trim()) return;
    
    try {
      const newComment = await addCommentToPost(postId, commentText[postId]);
      if (newComment) {
        setComments(prev => ({ 
          ...prev, 
          [postId]: [...(prev[postId] || []), newComment] 
        }));
        setCommentText(prev => ({ ...prev, [postId]: '' }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleNewPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdvisor) {
      alert('Only verified financial advisors can create posts in this forum');
      return;
    }
    
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    setSubmitting(true);
    
    try {
      const post = await createForumPost(
        newPostTitle, 
        newPostContent, 
        true, 
        stockSymbol.trim() || undefined
      );
      if (post) {
        setPosts(prev => [post, ...prev]);
        setNewPostTitle('');
        setNewPostContent('');
        setStockSymbol('');
        setShowNewPostForm(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = searchTerm
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.stock_symbol && post.stock_symbol.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="dark-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="dark-header text-2xl mb-2">Financial Advisor Forum</h1>
            <p className="dark-text">Professional market analysis and investment advice</p>
          </div>
          
          {isAdvisor && (
            <button 
              onClick={() => setShowNewPostForm(prev => !prev)}
              className="btn-primary flex items-center mt-4 md:mt-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showNewPostForm ? 'Cancel' : 'New Analysis'}
            </button>
          )}
        </div>

        <div className="flex items-center mb-6 bg-gray-900 p-3 rounded-lg">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search analyses..."
              className="input-primary pl-10"
            />
          </div>
        </div>

        {showNewPostForm && (
          <form onSubmit={handleNewPostSubmit} className="mb-6 bg-gray-900 p-4 rounded-lg">
            <div className="mb-4">
              <label htmlFor="post-title" className="block dark-subheader mb-2">Title</label>
              <input
                id="post-title"
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Enter title for your analysis"
                className="input-primary"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="stock-symbol" className="block dark-subheader mb-2">Stock Symbol (optional)</label>
              <input
                id="stock-symbol"
                type="text"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                placeholder="e.g. AAPL, MSFT"
                className="input-primary"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="post-content" className="block dark-subheader mb-2">Analysis</label>
              <textarea
                id="post-content"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your professional analysis and insights..."
                className="input-primary min-h-[200px]"
                required
              />
            </div>
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Posting...' : 'Post Analysis'}
              </button>
            </div>
          </form>
        )}

        <div className="mb-4 rounded-lg bg-blue-900 p-4 flex items-start">
          <Info className="h-5 w-5 text-blue-300 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="dark-header text-blue-300 mb-1">About the Advisor Forum</h3>
            <p className="dark-text text-sm">
              This forum features analyses and insights from verified financial advisors. 
              While anyone can read and comment, only verified advisors can post new analyses.
              Advisors must pass our verification process to confirm their credentials.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="dark-card animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-500 mb-3" />
            <p className="dark-text">
              {searchTerm 
                ? 'No analyses match your search criteria' 
                : 'No advisor analyses available yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-start mb-2">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                    {post.user?.photo_url ? (
                      <img 
                        src={post.user.photo_url} 
                        alt={post.user.display_name || 'Advisor'} 
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <span className="text-gray-300">{(post.user?.display_name || 'Advisor')[0]}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="dark-subheader">{post.title}</h3>
                      <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded flex items-center">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Advisor
                      </span>
                      {post.stock_symbol && (
                        <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                          {post.stock_symbol}
                        </span>
                      )}
                    </div>
                    <div className="dark-text text-sm">
                      Posted by {post.user?.display_name || 'Unknown'} • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      {post.advisor && (
                        <span className="ml-2 text-gray-400">
                          {post.advisor.specialty && `${post.advisor.specialty} • `}
                          {post.advisor.years_experience} years experience
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="dark-text mb-3">{post.content}</div>
                
                <div className="flex items-center text-sm">
                  <button className="flex items-center text-gray-400 hover:text-blue-400 mr-4">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{post.likes || 0}</span>
                  </button>
                  <button 
                    onClick={() => togglePostExpansion(post.id)}
                    className="flex items-center text-gray-400 hover:text-blue-400"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{post.comment_count || 0} comments</span>
                    {expandedPost === post.id ? (
                      <ChevronUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </div>
                
                {expandedPost === post.id && (
                  <div className="mt-4 border-t border-gray-700 pt-4">
                    {comments[post.id]?.length > 0 ? (
                      <div className="mb-4 space-y-3">
                        {comments[post.id].map(comment => (
                          <div key={comment.id} className="bg-gray-800 rounded p-3">
                            <div className="flex items-start">
                              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-2">
                                {comment.user?.photo_url ? (
                                  <img 
                                    src={comment.user.photo_url} 
                                    alt={comment.user.display_name || 'User'} 
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <span className="text-gray-300 text-sm">{(comment.user?.display_name || 'User')[0]}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="dark-subheader text-sm">{comment.user?.display_name || 'Unknown'}</span>
                                  <span className="text-gray-500 text-xs">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                                </div>
                                <p className="dark-text text-sm">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm mb-4">No comments yet</p>
                    )}
                    
                    {isAdvisor && (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={commentText[post.id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Add a comment..."
                          className="input-primary flex-1 mr-2"
                        />
                        <button 
                          onClick={() => handleCommentSubmit(post.id)}
                          className="btn-primary p-2"
                          disabled={!commentText[post.id]?.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisorForum; 