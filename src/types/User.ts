export interface User {
  uid: string;
  email: string;
  displayName?: string;
  username?: string;
  photoURL?: string;
  tokens: number;
  referralId: string;
  referredBy?: string;
  referralCount: number;
  completedQuests: {
    [questId: string]: {
      completedAt: number;
      rewarded: boolean;
    };
  };
  lastFeedback?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  tokenReward: number;
  type: 'daily' | 'weekly' | 'achievement';
  requirement: {
    type: 'login' | 'feedback' | 'viewStock' | 'createWatchlist' | 'research';
    count?: number;
    specific?: string;
  };
  expiresAt?: number;
}

export interface Feedback {
  id: string;
  userId: string;
  rating: number;
  comments?: string;
  createdAt: number;
} 