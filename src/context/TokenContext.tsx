import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Quest } from '../types/User';
import { useAuth } from './AuthContext';
import { 
  getUserData, 
  createOrUpdateUser, 
  addTokens, 
  getAvailableQuests, 
  completeQuest,
  submitFeedback
} from '../services/tokenService';

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
        const data = await getUserData(user.uid);
        
        if (data) {
          setUserData(data);
        } else {
          // Create user if not exists
          await createOrUpdateUser({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
          });
          
          // Fetch again after creation
          const newData = await getUserData(user.uid);
          setUserData(newData);
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
        const availableQuests = await getAvailableQuests();
        setQuests(availableQuests);
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
      const data = await getUserData(user.uid);
      if (data) {
        setUserData(data);
      }
    }
  };

  // Add tokens to user
  const addUserTokens = async (amount: number) => {
    if (user) {
      const success = await addTokens(user.uid, amount);
      if (success) {
        await refreshUserData();
      }
      return success;
    }
    return false;
  };

  // Complete a quest
  const completeUserQuest = async (questId: string) => {
    if (user) {
      const success = await completeQuest(user.uid, questId);
      if (success) {
        await refreshUserData();
      }
      return success;
    }
    return false;
  };

  // Submit feedback
  const submitUserFeedback = async (rating: number, comments?: string) => {
    if (user) {
      const success = await submitFeedback(user.uid, rating, comments);
      if (success) {
        await refreshUserData();
      }
      return success;
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