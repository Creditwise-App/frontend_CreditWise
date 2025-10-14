// src/context/CreditTipsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CreditPlan {
  userId: string;
  plan: string;
}

interface CreditTipsContextType {
  plans: CreditPlan[];
  getUserPlan: (userId: string) => string | undefined;
  setUserPlan: (userId: string, plan: string) => void;
}

const CreditTipsContext = createContext<CreditTipsContextType | undefined>(undefined);

export const CreditTipsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<CreditPlan[]>(() => {
    // 🔁 Load from localStorage when app initializes
    const saved = localStorage.getItem('creditPlans');
    return saved ? JSON.parse(saved) : [];
  });

  // 💾 Save to localStorage whenever plans change
  useEffect(() => {
    localStorage.setItem('creditPlans', JSON.stringify(plans));
  }, [plans]);

  const getUserPlan = (userId: string) => {
    return plans.find(p => p.userId === userId)?.plan;
  };

  const setUserPlan = (userId: string, plan: string) => {
    setPlans(prev => {
      const existing = prev.find(p => p.userId === userId);
      if (existing) {
        return prev.map(p => p.userId === userId ? { ...p, plan } : p);
      }
      return [...prev, { userId, plan }];
    });
  };

  return (
    <CreditTipsContext.Provider value={{ plans, getUserPlan, setUserPlan }}>
      {children}
    </CreditTipsContext.Provider>
  );
};

export const useCreditTips = () => {
  const context = useContext(CreditTipsContext);
  if (!context) throw new Error('useCreditTips must be used inside CreditTipsProvider');
  return context;
};
