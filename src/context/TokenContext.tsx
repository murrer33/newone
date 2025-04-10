import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Quest } from '../types/User';
import { useAuth } from './AuthContext';
import { 
  createUserProfile,
  getUserProfile
} from '../services/supabaseClient';
import { supabase } from '../services/supabaseClient';

interface TokenContextType {
  userData: User | null;
  quests: Quest[];
  loading: boolean;
  isOffline: boolean;
  refreshUserData: () => Promise<void>;
  addUserTokens: (amount: number) => Promise<boolean>;
  completeUserQuest: (questId: string) => Promise<boolean>;
  submitUserFeedback: (rating: number, comments?: string) => Promise<boolean>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load user data when auth user changes
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setLoading(true);
        const data = await getUserProfile(user.id);
        
        if (data) {
          // Convert from Supabase format to our User format
          setUserData({
            uid: data.uid,
            email: data.email,
            displayName: data.display_name,
            username: data.username,
            photoURL: data.photo_url,
            tokens: data.tokens,
            referralId: data.referral_id,
            referredBy: data.referred_by,
            referralCount: data.referral_count,
            completedQuests: data.completed_quests || {},
            lastFeedback: data.last_feedback,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          });
        } else {
          // Create user if not exists
          await createUserProfile(user.id, {
            email: user.email || '',
            displayName: user.user_metadata?.display_name || '',
            photoURL: user.user_metadata?.avatar_url || '',
          });
          
          // Fetch again after creation
          const newData = await getUserProfile(user.id);
          if (newData) {
            setUserData({
              uid: newData.uid,
              email: newData.email,
              displayName: newData.display_name,
              username: newData.username,
              photoURL: newData.photo_url,
              tokens: newData.tokens,
              referralId: newData.referral_id,
              referredBy: newData.referred_by,
              referralCount: newData.referral_count,
              completedQuests: newData.completed_quests || {},
              lastFeedback: newData.last_feedback,
              createdAt: newData.created_at,
              updatedAt: newData.updated_at
            });
          }
        }
        
        setLoading(false);
      } else {
        setUserData(null);
      }
    };
    
    loadUserData();
  }, [user]);
  
  // Load available quests
  useEffect(() => {
    const loadQuests = async () => {
      if (user) {
        try {
          const now = Date.now();
          const { data, error } = await supabase
            .from('quests')
            .select('*')
            .gt('expires_at', now);
          
          if (error) {
            console.error('Error fetching quests:', error);
            return;
          }
          
          if (data) {
            const formattedQuests: Quest[] = data.map(quest => ({
              id: quest.id,
              title: quest.title,
              description: quest.description,
              tokenReward: quest.token_reward,
              type: quest.type,
              requirement: quest.requirement,
              expiresAt: quest.expires_at
            }));
            
            setQuests(formattedQuests);
          }
        } catch (error) {
          console.error('Error loading quests:', error);
        }
      }
    };
    
    loadQuests();
    
    // Refresh quests every hour
    const interval = setInterval(loadQuests, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Refresh user data when coming back online
  useEffect(() => {
    if (!isOffline && user && userData) {
      refreshUserData();
    }
  }, [isOffline, user]);

  // Refresh user data function
  const refreshUserData = async () => {
    if (user) {
      const data = await getUserProfile(user.id);
      if (data) {
        setUserData({
          uid: data.uid,
          email: data.email,
          displayName: data.display_name,
          username: data.username,
          photoURL: data.photo_url,
          tokens: data.tokens,
          referralId: data.referral_id,
          referredBy: data.referred_by,
          referralCount: data.referral_count,
          completedQuests: data.completed_quests || {},
          lastFeedback: data.last_feedback,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        });
      }
    }
  };

  // Add tokens to user
  const addUserTokens = async (amount: number) => {
    if (user) {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('tokens')
          .eq('uid', user.id)
          .single();
        
        if (!userData) return false;
        
        const { error } = await supabase
          .from('users')
          .update({ 
            tokens: userData.tokens + amount,
            updated_at: Date.now()
          })
          .eq('uid', user.id);
        
        if (error) {
          console.error('Error adding tokens:', error);
          return false;
        }
        
        await refreshUserData();
        return true;
      } catch (error) {
        console.error('Error adding tokens:', error);
        return false;
      }
    }
    return false;
  };

  // Complete a quest
  const completeUserQuest = async (questId: string) => {
    if (user) {
      try {
        // Get current user data and quest data
        const [userData, questData] = await Promise.all([
          supabase.from('users').select('*').eq('uid', user.id).single(),
          supabase.from('quests').select('*').eq('id', questId).single()
        ]);
        
        if (userData.error || questData.error) {
          console.error('Error fetching data:', userData.error || questData.error);
          return false;
        }
        
        const userCompleted = userData.data.completed_quests || {};
        
        // Check if quest was already completed and rewarded
        if (userCompleted[questId]?.rewarded) {
          return false;
        }
        
        // Mark quest as completed
        const completedQuests = {
          ...userCompleted,
          [questId]: {
            completedAt: Date.now(),
            rewarded: true
          }
        };
        
        // Add tokens to user
        const { error } = await supabase
          .from('users')
          .update({
            completed_quests: completedQuests,
            tokens: userData.data.tokens + questData.data.token_reward,
            updated_at: Date.now()
          })
          .eq('uid', user.id);
        
        if (error) {
          console.error('Error completing quest:', error);
          return false;
        }
        
        await refreshUserData();
        return true;
      } catch (error) {
        console.error('Error completing quest:', error);
        return false;
      }
    }
    return false;
  };

  // Submit feedback
  const submitUserFeedback = async (rating: number, comments?: string) => {
    if (user) {
      try {
        const feedback = {
          id: `${user.id}_${Date.now()}`,
          user_id: user.id,
          rating,
          comments: comments || '',
          created_at: new Date().toISOString()
        };
        
        // Store feedback in Supabase
        const { error: feedbackError } = await supabase
          .from('feedbacks')
          .insert([feedback]);
        
        if (feedbackError) {
          console.error('Error submitting feedback:', feedbackError);
          return false;
        }
        
        // Update last feedback timestamp on user
        const { error: userError } = await supabase
          .from('users')
          .update({
            last_feedback: Date.now(),
            updated_at: Date.now()
          })
          .eq('uid', user.id);
        
        if (userError) {
          console.error('Error updating user feedback timestamp:', userError);
        }
        
        // Add tokens reward for feedback (10 tokens)
        await addUserTokens(10);
        
        return true;
      } catch (error) {
        console.error('Error submitting feedback:', error);
        return false;
      }
    }
    return false;
  };

  const value = {
    userData,
    quests,
    loading,
    isOffline,
    refreshUserData,
    addUserTokens,
    completeUserQuest,
    submitUserFeedback
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
      {isOffline && (
        <div className="fixed bottom-4 left-4 bg-amber-100 border border-amber-400 text-amber-800 px-4 py-2 rounded-md shadow-md z-50 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          You are currently offline. Some features may be limited.
        </div>
      )}
    </TokenContext.Provider>
  );
};

export default TokenContext; 