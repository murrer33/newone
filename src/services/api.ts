import { auth, db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// User API
export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: any) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Subscription API
export const createCheckoutSession = async (data: any) => {
  try {
    // In a production environment, this would call your backend API
    // For now, we're simulating this behavior
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create checkout session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const verifyPayment = async (sessionId: string, userId: string) => {
  try {
    // In a production environment, this would call your backend API
    // For now, we're simulating this behavior
    const response = await fetch(`${API_BASE_URL}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
      },
      body: JSON.stringify({ sessionId, userId })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to verify payment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Stock Data API
export const getStockData = async (symbol: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/${symbol}`, {
      headers: {
        'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch data for ${symbol}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    throw error;
  }
};

export const getMarketOverview = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/market/overview`, {
      headers: {
        'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch market overview');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching market overview:', error);
    throw error;
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  createCheckoutSession,
  verifyPayment,
  getStockData,
  getMarketOverview
}; 