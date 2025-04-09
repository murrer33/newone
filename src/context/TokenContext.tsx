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
    refreshUserData,
    addUserTokens,
    completeUserQuest,
    submitUserFeedback
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContext; 