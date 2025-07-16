import { createClient } from '@supabase/supabase-js';
import { Feedback, User } from '../types/User';

// Define types for Supabase records
interface SupabaseFeedback {
  id: string;
  user_id: string;
  rating: number;
  comments: string;
  created_at: string;
}

interface SupabaseUser {
  uid: string;
  email: string;
  display_name: string;
  username: string;
  photo_url: string;
  tokens: number;
  referral_id: string;
  referred_by: string;
  referral_count: number;
  completed_quests: any;
  last_feedback: number;
  created_at: number;
  updated_at: number;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// User-related functions for Supabase fallback

// Get user data from Supabase
export const getUserDataFromSupabase = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user from Supabase:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Convert from Supabase format to our User format
    const supaUser = data as SupabaseUser;
    return {
      uid: supaUser.uid,
      email: supaUser.email,
      displayName: supaUser.display_name,
      username: supaUser.username,
      photoURL: supaUser.photo_url,
      tokens: supaUser.tokens,
      referralId: supaUser.referral_id,
      referredBy: supaUser.referred_by,
      referralCount: supaUser.referral_count,
      completedQuests: supaUser.completed_quests || {},
      lastFeedback: supaUser.last_feedback,
      createdAt: supaUser.created_at,
      updatedAt: supaUser.updated_at
    };
  } catch (error) {
    console.error('Exception fetching user from Supabase:', error);
    return null;
  }
};

// Create or update user in Supabase
export const createOrUpdateUserInSupabase = async (user: Partial<User> & { uid: string }): Promise<boolean> => {
  try {
    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('uid')
      .eq('uid', user.uid)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "Did not return a single row"
      console.error('Error checking if user exists in Supabase:', checkError);
      return false;
    }
    
    const now = Date.now();
    
    if (existingUser) {
      // Update existing user
      const { error } = await supabase
        .from('users')
        .update({
          email: user.email,
          display_name: user.displayName || '',
          username: user.username || '',
          photo_url: user.photoURL || '',
          updated_at: now
        })
        .eq('uid', user.uid);
        
      if (error) {
        console.error('Error updating user in Supabase:', error);
        return false;
      }
    } else {
      // Create new user
      // Generate username and referral ID if not provided
      const username = user.username || (user.email ? user.email.split('@')[0] : `user${Math.floor(Math.random() * 10000)}`);
      const referralId = user.referralId || `${user.uid.substring(0, 6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      const { error } = await supabase
        .from('users')
        .insert([{
          uid: user.uid,
          email: user.email,
          display_name: user.displayName || '',
          username: username,
          photo_url: user.photoURL || '',
          tokens: user.tokens || 0,
          referral_id: referralId,
          referral_count: user.referralCount || 0,
          completed_quests: user.completedQuests || {},
          created_at: now,
          updated_at: now
        }]);
        
      if (error) {
        console.error('Error creating user in Supabase:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Exception in createOrUpdateUserInSupabase:', error);
    return false;
  }
};

// Add tokens to user in Supabase
export const addTokensInSupabase = async (userId: string, amount: number): Promise<boolean> => {
  try {
    // Get current user to get current token count
    const { data, error: fetchError } = await supabase
      .from('users')
      .select('tokens')
      .eq('uid', userId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching user tokens from Supabase:', fetchError);
      return false;
    }
    
    const currentTokens = data?.tokens || 0;
    
    // Update tokens
    const { error: updateError } = await supabase
      .from('users')
      .update({
        tokens: currentTokens + amount,
        updated_at: Date.now()
      })
      .eq('uid', userId);
      
    if (updateError) {
      console.error('Error updating tokens in Supabase:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in addTokensInSupabase:', error);
    return false;
  }
};

// Submit feedback to Supabase
export const submitFeedbackToSupabase = async (feedback: Feedback): Promise<boolean> => {
  try {
    // Make sure Supabase client is initialized properly
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }

    // Try to submit with retry logic (up to 3 attempts)
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      attempts++;
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
          console.error(`Attempt ${attempts}/${maxAttempts} - Error submitting feedback to Supabase:`, error);
          
          // If it's the last attempt, return false
          if (attempts === maxAttempts) {
            return false;
          }
          
          // Wait for a short delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        
        // Success
        return true;
      } catch (innerError) {
        console.error(`Attempt ${attempts}/${maxAttempts} - Exception in Supabase feedback submission:`, innerError);
        
        // If it's the last attempt, throw the error
        if (attempts === maxAttempts) {
          return false;
        }
        
        // Wait for a short delay before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return false;
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