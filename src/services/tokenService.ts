import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs, Timestamp, FirestoreError } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db } from './firebase';
import { User, Quest, Feedback } from '../types/User';
import { 
  submitFeedbackToSupabase, 
  getUserDataFromSupabase, 
  createOrUpdateUserInSupabase,
  addTokensInSupabase
} from './supabase';

// Helper function to check if error is due to being offline
const isOfflineError = (error: any): boolean => {
  return error && 
    (error instanceof FirebaseError || error instanceof FirestoreError) && 
    (error.message.includes('offline') || error.code === 'unavailable');
};

// Generate a unique referral ID
const generateReferralId = (userId: string): string => {
  // Use the first 6 characters of the user ID and add a random string
  const prefix = userId.substring(0, 6);
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${randomStr}`;
};

// Get user data
export const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    
    // If the error is due to being offline, try Supabase
    if (isOfflineError(error)) {
      console.log('Firebase offline, falling back to Supabase for user data');
      return getUserDataFromSupabase(userId);
    }
    
    return null;
  }
};

// Create or update user data
export const createOrUpdateUser = async (user: Partial<User> & { uid: string }): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        ...user,
        updatedAt: Date.now(),
      });
    } else {
      // Generate a referral ID for new users
      const referralId = generateReferralId(user.uid);
      
      // Generate a default username (can be changed later)
      const username = user.email ? user.email.split('@')[0] : `user${Math.floor(Math.random() * 10000)}`;
      
      // Create new user
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        username,
        tokens: 0,
        referralId,
        referralCount: 0,
        completedQuests: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...user
      });
    }
    
    // Also sync to Supabase for offline fallback
    createOrUpdateUserInSupabase(user).catch(err => {
      console.warn('Failed to sync user to Supabase:', err);
    });
    
    return true;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    
    // If the error is due to being offline, try Supabase
    if (isOfflineError(error)) {
      console.log('Firebase offline, falling back to Supabase for user creation/update');
      return createOrUpdateUserInSupabase(user);
    }
    
    return false;
  }
};

// Process a referral
export const processReferral = async (referralId: string, newUserId: string): Promise<boolean> => {
  try {
    // Find the user with this referral ID
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referralId', '==', referralId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return false;
    }
    
    // Get the referrer user
    const referrerDoc = querySnapshot.docs[0];
    const referrerId = referrerDoc.id;
    const referrerData = referrerDoc.data() as User;
    
    // Update referrer with new count and reward tokens
    await updateDoc(doc(db, 'users', referrerId), {
      referralCount: (referrerData.referralCount || 0) + 1,
      tokens: (referrerData.tokens || 0) + 50, // 50 tokens reward
      updatedAt: Date.now()
    });
    
    // Update the new user to include who referred them
    await updateDoc(doc(db, 'users', newUserId), {
      referredBy: referrerId,
      updatedAt: Date.now()
    });
    
    return true;
  } catch (error) {
    console.error('Error processing referral:', error);
    // No Supabase fallback for this specific function as it's more complex
    return false;
  }
};

// Get referral link for a user
export const getReferralLink = (referralId: string): string => {
  return `${window.location.origin}/register?ref=${referralId}`;
};

// Add tokens to user
export const addTokens = async (userId: string, amount: number): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as User;
      await updateDoc(userRef, {
        tokens: (userData.tokens || 0) + amount,
        updatedAt: Date.now()
      });
      
      // Also sync to Supabase
      addTokensInSupabase(userId, amount).catch(err => {
        console.warn('Failed to sync tokens to Supabase:', err);
      });
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding tokens:', error);
    
    // If the error is due to being offline, try Supabase
    if (isOfflineError(error)) {
      console.log('Firebase offline, falling back to Supabase for adding tokens');
      return addTokensInSupabase(userId, amount);
    }
    
    return false;
  }
};

// Get available quests
export const getAvailableQuests = async (): Promise<Quest[]> => {
  try {
    const now = Date.now();
    const questsRef = collection(db, 'quests');
    const q = query(questsRef, where('expiresAt', '>', now));
    const questsSnap = await getDocs(q);
    
    return questsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Quest));
  } catch (error) {
    console.error('Error getting quests:', error);
    // In offline mode, return empty array as quests are not critical
    return [];
  }
};

// Complete a quest
export const completeQuest = async (userId: string, questId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    const questRef = doc(db, 'quests', questId);
    
    const [userSnap, questSnap] = await Promise.all([
      getDoc(userRef),
      getDoc(questRef)
    ]);
    
    if (userSnap.exists() && questSnap.exists()) {
      const userData = userSnap.data() as User;
      const questData = questSnap.data() as Quest;
      
      // Check if quest was already completed and rewarded
      if (userData.completedQuests?.[questId]?.rewarded) {
        return false;
      }
      
      // Mark quest as completed
      const completedQuests = {
        ...userData.completedQuests,
        [questId]: {
          completedAt: Date.now(),
          rewarded: true
        }
      };
      
      // Add tokens to user
      await updateDoc(userRef, {
        completedQuests,
        tokens: (userData.tokens || 0) + questData.tokenReward,
        updatedAt: Date.now()
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error completing quest:', error);
    // No Supabase fallback for this as it's not critical
    return false;
  }
};

// Submit feedback
export const submitFeedback = async (userId: string, rating: number, comments?: string): Promise<boolean> => {
  try {
    const feedbackRef = collection(db, 'feedback');
    const feedback: Feedback = {
      id: `${userId}_${Date.now()}`,
      userId,
      rating,
      comments,
      createdAt: Date.now()
    };
    
    // Store feedback in Firebase
    await setDoc(doc(feedbackRef, feedback.id), feedback);
    
    // Update last feedback timestamp on user
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      lastFeedback: Date.now(),
      updatedAt: Date.now()
    });
    
    // Add tokens reward for feedback (10 tokens)
    await addTokens(userId, 10);
    
    // Also store feedback in Supabase
    submitFeedbackToSupabase(feedback)
      .then(success => {
        if (!success) {
          console.warn('Failed to store feedback in Supabase, but it was stored in Firebase');
        }
      })
      .catch(error => {
        console.error('Error storing feedback in Supabase:', error);
      });
    
    return true;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    
    // If the error is due to being offline, try Supabase
    if (isOfflineError(error)) {
      console.log('Firebase offline, falling back to Supabase for feedback submission');
      
      try {
        // Directly submit to Supabase
        const feedback: Feedback = {
          id: `${userId}_${Date.now()}`,
          userId,
          rating,
          comments,
          createdAt: Date.now()
        };
        
        const success = await submitFeedbackToSupabase(feedback);
        
        if (success) {
          // Also try to add tokens via Supabase
          await addTokensInSupabase(userId, 10);
        }
        
        return success;
      } catch (supabaseError) {
        console.error('Supabase fallback also failed:', supabaseError);
        return false;
      }
    }
    
    return false;
  }
}; 