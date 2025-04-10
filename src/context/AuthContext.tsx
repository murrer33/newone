import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  supabase, 
  signIn as supabaseSignIn, 
  signInWithGoogle as supabaseSignInWithGoogle,
  signUp as supabaseSignUp,
  signOut as supabaseSignOut,
  getCurrentUser
} from '../services/supabaseClient';

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<SupabaseUser | null>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<SupabaseUser | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      try {
        // Get current session
        const { user, error } = await getCurrentUser();
        
        if (error) {
          throw error;
        }
        
        if (user) {
          setUser(user);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err instanceof Error ? err.message : 'Authentication error');
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Login with email and password
  const login = async (email: string, password: string): Promise<SupabaseUser | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { user, error } = await supabaseSignIn(email, password);
      
      if (error) {
        throw error;
      }
      
      setUser(user);
      return user;
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Login with Google
  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await supabaseSignInWithGoogle();
    } catch (err) {
      console.error('Google login error:', err);
      setError(err instanceof Error ? err.message : 'Google login failed');
    } finally {
      setLoading(false);
    }
  };
  
  // Register with email and password
  const register = async (email: string, password: string, displayName?: string): Promise<SupabaseUser | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { user, error } = await supabaseSignUp(email, password, displayName);
      
      if (error) {
        throw error;
      }
      
      setUser(user);
      return user;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout
  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabaseSignOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 