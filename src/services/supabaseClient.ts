import { createClient, SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth methods
export const signUp = async (email: string, password: string, displayName?: string): Promise<{
  user: SupabaseUser | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
        }
      }
    });

    if (error) throw error;

    // Create a new user entry in users table with default values
    if (data.user) {
      await createUserProfile(data.user.id, {
        email: data.user.email || '',
        displayName: displayName || email.split('@')[0],
      });
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { user: null, error: error as Error };
  }
};

export const signIn = async (email: string, password: string): Promise<{
  user: SupabaseUser | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { user: null, error: error as Error };
  }
};

export const signInWithGoogle = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
};

export const signOut = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error: error as Error };
  }
};

export const getCurrentUser = async (): Promise<{
  user: SupabaseUser | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error: error as Error };
  }
};

export const getSession = async (): Promise<{
  session: Session | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Error getting session:', error);
    return { session: null, error: error as Error };
  }
};

export const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { error: error as Error };
  }
};

// User profile functions
export const createUserProfile = async (userId: string, userData: { 
  email: string; 
  displayName?: string;
  photoURL?: string;
}): Promise<boolean> => {
  try {
    // Generate username and referral ID
    const username = userData.displayName || userData.email.split('@')[0];
    const referralId = `${userId.substring(0, 6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const { error } = await supabase
      .from('users')
      .insert([{
        uid: userId,
        email: userData.email,
        display_name: userData.displayName || '',
        username: username,
        photo_url: userData.photoURL || '',
        tokens: 0,
        referral_id: referralId,
        referral_count: 0,
        completed_quests: {},
        created_at: Date.now(),
        updated_at: Date.now()
      }]);
      
    if (error) {
      console.error('Error creating user profile:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}; 