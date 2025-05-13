import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  ChevronDown, 
  ChevronUp,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getForumPosts, 
  getCommentsForPost, 
  addCommentToPost, 
  createForumPost,
  ForumPost,
  ForumComment
} from '../services/forumService';
import { formatDistanceToNow } from 'date-fns';

interface StockForumSectionProps {
  stockSymbol: string;
}

const StockForumSection: React.FC<StockForumSectionProps> = ({ stockSymbol }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, ForumComment[]>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [stockSymbol]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getForumPosts(1, 5, false, stockSymbol);
      setPosts(response.posts);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
    } finally {
      setLoading(false);
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
    if (!user) {
      alert('You must be logged in to comment');
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
    
    if (!user) {
      alert('You must be logged in to create a post');
      return;
    }
    
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    setSubmitting(true);
    
    try {
      const post = await createForumPost(newPostTitle, newPostContent, false, stockSymbol);
      if (post) {
        setPosts(prev => [post, ...prev]);
        setNewPostTitle('');
        setNewPostContent('');
        setShowNewPostForm(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dark-card mt-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="dark-card mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="dark-header text-xl">Stock Discussion</h2>
        {user && (
          <button 
            onClick={() => setShowNewPostForm(prev => !prev)}
            className="btn-primary flex items-center"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {showNewPostForm ? 'Cancel' : 'New Post'}
          </button>
        )}
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
              placeholder="Enter post title"
              className="input-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="post-content" className="block dark-subheader mb-2">Content</label>
            <textarea
              id="post-content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your thoughts about this stock..."
              className="input-primary min-h-[100px]"
              required
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-500 mb-3" />
          <p className="dark-text">No posts yet. Be the first to start a discussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-start mb-2">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                  {post.user?.photo_url ? (
                    <img 
                      src={post.user.photo_url} 
                      alt={post.user.display_name || 'User'} 
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <span className="text-gray-300">{(post.user?.display_name || 'User')[0]}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="dark-subheader mr-2">{post.title}</h3>
                    {post.is_advisor_post && (
                      <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded flex items-center">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Advisor
                      </span>
                    )}
                  </div>
                  <div className="dark-text text-sm">
                    Posted by {post.user?.display_name || 'Unknown'} • {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
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
                  
                  {user ? (
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
                  ) : (
                    <p className="text-gray-500 text-sm">Log in to comment</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockForumSection; 