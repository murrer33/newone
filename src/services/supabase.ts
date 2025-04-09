import { createClient } from '@supabase/supabase-js';
import { Feedback } from '../types/User';

// Define types for Supabase records
interface SupabaseFeedback {
  id: string;
  user_id: string;
  rating: number;
  comments: string;
  created_at: string;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Submit feedback to Supabase
export const submitFeedbackToSupabase = async (feedback: Feedback): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert([
        {
          id: feedback.id,
          user_id: feedback.userId,
          rating: feedback.rating,
          comments: feedback.comments || '',
          created_at: new Date(feedback.createdAt).toISOString()
        }
      ]);
      
    if (error) {
      console.error('Error submitting feedback to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception submitting feedback to Supabase:', error);
    return false;
  }
};

// Get all feedbacks for admin dashboard
export const getAllFeedbacks = async (): Promise<Feedback[]> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching feedbacks from Supabase:', error);
      return [];
    }
    
    return (data as SupabaseFeedback[]).map(item => ({
      id: item.id,
      userId: item.user_id,
      rating: item.rating,
      comments: item.comments,
      createdAt: new Date(item.created_at).getTime()
    }));
  } catch (error) {
    console.error('Exception fetching feedbacks from Supabase:', error);
    return [];
  }
};

// Get user feedbacks
export const getUserFeedbacks = async (userId: string): Promise<Feedback[]> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user feedbacks from Supabase:', error);
      return [];
    }
    
    return (data as SupabaseFeedback[]).map(item => ({
      id: item.id,
      userId: item.user_id,
      rating: item.rating,
      comments: item.comments,
      createdAt: new Date(item.created_at).getTime()
    }));
  } catch (error) {
    console.error('Exception fetching user feedbacks from Supabase:', error);
    return [];
  }
}; 