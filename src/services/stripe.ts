import { loadStripe } from '@stripe/stripe-js';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CreateCheckoutSessionParams {
  userId: string;
  planId: string;
  planName: string;
  planPrice: number;
}

export const createCheckoutSession = async ({
  userId,
  planId,
  planName,
  planPrice
}: CreateCheckoutSessionParams) => {
  try {
    // Store the checkout session details in Firestore
    const checkoutSessionRef = doc(db, 'users', userId, 'checkout_sessions', Date.now().toString());
    
    // Create a new checkout session document
    await setDoc(checkoutSessionRef, {
      price: planPrice,
      planId,
      planName,
      status: 'pending',
      created: new Date(),
    });

    // Call our serverless function to create a Stripe checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        planId,
        planName,
        planPrice,
        checkoutSessionId: checkoutSessionRef.id,
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async (userId: string) => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId);
    const subscriptionDoc = await getDoc(subscriptionRef);
    
    if (subscriptionDoc.exists()) {
      return subscriptionDoc.data();
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
};

export const getSubscriptionPlanFeatures = (planId: string) => {
  const plans = {
    basic: {
      apiCalls: 100,
      realTimeData: false,
      historicalData: '1 year',
      customAlerts: 5,
      stockScreener: true,
      technicalIndicators: ['SMA', 'EMA', 'RSI'],
    },
    intermediate: {
      apiCalls: 500,
      realTimeData: true,
      historicalData: '5 years',
      customAlerts: 20,
      stockScreener: true,
      portfolioAnalysis: true,
      technicalIndicators: ['SMA', 'EMA', 'RSI', 'MACD', 'Bollinger Bands'],
    },
    advanced: {
      apiCalls: 'Unlimited',
      realTimeData: true,
      historicalData: '10 years',
      customAlerts: 'Unlimited',
      stockScreener: true,
      portfolioAnalysis: true,
      aiPredictions: true,
      sentimentAnalysis: true,
      technicalIndicators: 'All',
    }
  };
  
  return plans[planId as keyof typeof plans] || plans.basic;
};

export default {
  createCheckoutSession,
  getSubscriptionStatus,
  getSubscriptionPlanFeatures,
}; 