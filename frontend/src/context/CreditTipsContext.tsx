// src/context/CreditTipsContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CreditTip } from '../../types';
import { tipsAPI } from '../services/api';

interface CreditTipsContextType {
  tips: CreditTip[];
  loading: boolean;
  error: string | null;
  fetchTips: () => Promise<void>;
  userPlans: Record<string, string>; // Store user plans by userId
  setUserPlan: (userId: string, plan: string) => void; // Function to set a user's plan
  getUserPlan: (userId: string) => string | null; // Function to get a user's plan
}

const CreditTipsContext = createContext<CreditTipsContextType | undefined>(undefined);

export const CreditTipsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tips, setTips] = useState<CreditTip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userPlans, setUserPlans] = useState<Record<string, string>>({});
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Use useCallback to memoize the fetchTips function
  const fetchTips = useCallback(async () => {
    // Prevent fetching too frequently (less than 5 minutes)
    const now = Date.now();
    if (now - lastFetchTime < 5 * 60 * 1000) {
      return;
    }
    
    try {
      setLoading(true);
      const data = await tipsAPI.getAllTips();
      // Map the API response to match our CreditTip type
      const mappedTips = data.map((tip: any) => ({
        id: tip._id,
        title: tip.title,
        description: tip.description,
        createdAt: tip.createdAt
      }));
      setTips(mappedTips);
      setError(null);
      setLastFetchTime(now); // Update the last fetch time
    } catch (err: any) {
      setError(err.message || 'Failed to fetch credit tips');
      console.error('Error fetching credit tips:', err);
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime]);

  // Function to set a user's plan
  const setUserPlan = useCallback((userId: string, plan: string) => {
    setUserPlans(prev => ({
      ...prev,
      [userId]: plan
    }));
  }, []);

  // Function to get a user's plan
  const getUserPlan = useCallback((userId: string) => {
    return userPlans[userId] || null;
  }, [userPlans]);

  // Fetch tips once when the provider mounts
  useEffect(() => {
    fetchTips();
  }, [fetchTips]);

  return (
    <CreditTipsContext.Provider value={{ tips, loading, error, fetchTips, userPlans, setUserPlan, getUserPlan }}>
      {children}
    </CreditTipsContext.Provider>
  );
};

export const useCreditTips = () => {
  const context = useContext(CreditTipsContext);
  if (!context) throw new Error('useCreditTips must be used inside CreditTipsProvider');
  return context;
};