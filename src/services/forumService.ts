import { supabase } from './supabaseClient';

// Types
export interface ForumPost {
  id: string;
  user_id: string;
  stock_symbol: string | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes: number;
  is_advisor_post: boolean;
  user?: {
    display_name: string;
    username: string;
    photo_url: string;
  };
  advisor?: {
    credentials: string;
    years_experience: number;
    specialty: string;
  };
  comment_count?: number;
}

export interface ForumComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes: number;
  user?: {
    display_name: string;
    username: string;
    photo_url: string;
  };
}

export interface FinancialAdvisor {
  id: string;
  user_id: string;
  is_verified: boolean;
  verification_date: string | null;
  license_number: string | null;
  credentials: string | null;
  years_experience: number | null;
  specialty: string | null;
  bio: string | null;
  profile_image: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
}

// Get all forum posts (paginated)
export const getForumPosts = async (
  page = 1, 
  limit = 10, 
  advisorOnly = false,
  stockSymbol?: string
): Promise<{ posts: ForumPost[], count: number }> => {
  try {
    let query = supabase
      .from('forum_posts')
      .select(`
        *,
        user:user_id(display_name, username, photo_url),
        advisor:financial_advisors!inner(credentials, years_experience, specialty),
        comment_count:forum_comments(count)
      `, { count: 'exact' });
    
    // Apply filters
    if (advisorOnly) {
      query = query.eq('is_advisor_post', true);
    }
    
    if (stockSymbol) {
      query = query.eq('stock_symbol', stockSymbol);
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return { 
      posts: data as ForumPost[], 
      count: count || 0 
    };
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return { posts: [], count: 0 };
  }
};

// Get a single forum post by ID
export const getForumPostById = async (postId: string): Promise<ForumPost | null> => {
  try {
    const { data, error } = await supabase
      .from('forum_posts')
      .select(`
        *,
        user:user_id(display_name, username, photo_url),
        advisor:financial_advisors(credentials, years_experience, specialty)
      `)
      .eq('id', postId)
      .single();
    
    if (error) throw error;
    
    return data as ForumPost;
  } catch (error) {
    console.error('Error fetching forum post:', error);
    return null;
  }
};

// Get comments for a forum post
export const getCommentsForPost = async (postId: string): Promise<ForumComment[]> => {
  try {
    const { data, error } = await supabase
      .from('forum_comments')
      .select(`
        *,
        user:user_id(display_name, username, photo_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data as ForumComment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

// Create a new forum post
export const createForumPost = async (
  title: string,
  content: string,
  isAdvisorPost = false,
  stockSymbol?: string
): Promise<ForumPost | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData.user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        user_id: userData.user.id,
        title,
        content,
        stock_symbol: stockSymbol || null,
        is_advisor_post: isAdvisorPost
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as ForumPost;
  } catch (error) {
    console.error('Error creating forum post:', error);
    return null;
  }
};

// Add a comment to a forum post
export const addCommentToPost = async (
  postId: string,
  content: string
): Promise<ForumComment | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData.user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('forum_comments')
      .insert({
        post_id: postId,
        user_id: userData.user.id,
        content
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as ForumComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

// Check if current user is a verified financial advisor
export const isVerifiedAdvisor = async (): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData.user) return false;
    
    const { data, error } = await supabase
      .from('financial_advisors')
      .select('is_verified')
      .eq('user_id', userData.user.id)
      .single();
    
    if (error) return false;
    
    return data.is_verified === true;
  } catch (error) {
    console.error('Error checking advisor status:', error);
    return false;
  }
};

// Apply to become a financial advisor
export const applyForAdvisorStatus = async (
  credentials: string,
  licenseNumber: string,
  yearsExperience: number,
  specialty: string,
  bio: string,
  contactEmail: string
): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData.user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('financial_advisors')
      .insert({
        user_id: userData.user.id,
        license_number: licenseNumber,
        credentials,
        years_experience: yearsExperience,
        specialty,
        bio,
        contact_email: contactEmail
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error applying for advisor status:', error);
    return false;
  }
}; 