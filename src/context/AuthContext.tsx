import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthenticatedUser, UserRole } from '../../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: AuthenticatedUser | null;
  login: (email: string, pass: string) => Promise<AuthenticatedUser>;
  logout: () => void;
  register: (email: string, pass: string, name: string) => Promise<AuthenticatedUser>;
  updateUser: (userData: Partial<AuthenticatedUser>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      console.log('Stored user from localStorage:', storedUser);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user from localStorage:', parsedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<AuthenticatedUser> => {
    try {
      const userData = await authAPI.login(email, pass);
      console.log('Login response data:', userData);
      
      const authenticatedUser: AuthenticatedUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role as UserRole,
        token: userData.token
      };
      
      // Always include credit fields if they exist in the response, even if null
      if ('currentCreditScore' in userData) {
        authenticatedUser.currentCreditScore = userData.currentCreditScore;
      }
      if ('targetCreditScore' in userData) {
        authenticatedUser.targetCreditScore = userData.targetCreditScore;
      }
      if ('extraMonthlyPayment' in userData) {
        authenticatedUser.extraMonthlyPayment = userData.extraMonthlyPayment;
      }
      
      console.log('Authenticated user object:', authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      console.log('User stored in localStorage:', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (error: any) {
      throw new Error(error.message || 'Invalid email or password');
    }
  };

  const register = async (email: string, pass: string, name: string): Promise<AuthenticatedUser> => {
    try {
      const userData = await authAPI.register(email, pass, name);
      const authenticatedUser: AuthenticatedUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role as UserRole,
        token: userData.token
      };
      
      // Always include credit fields if they exist in the response, even if null
      if ('currentCreditScore' in userData) {
        authenticatedUser.currentCreditScore = userData.currentCreditScore;
      }
      if ('targetCreditScore' in userData) {
        authenticatedUser.targetCreditScore = userData.targetCreditScore;
      }
      if ('extraMonthlyPayment' in userData) {
        authenticatedUser.extraMonthlyPayment = userData.extraMonthlyPayment;
      }
      
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Add method to update user data
  const updateUser = (userData: Partial<AuthenticatedUser>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};