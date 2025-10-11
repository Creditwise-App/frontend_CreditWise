
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthenticatedUser, UserRole } from '../../types';
import { MOCK_USERS } from '../../constants';

interface AuthContextType {
  user: AuthenticatedUser | null;
  login: (email: string, pass: string) => Promise<AuthenticatedUser>;
  logout: () => void;
  register: (email: string, pass: string, name: string) => Promise<AuthenticatedUser>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<AuthenticatedUser> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email === email);
        if (foundUser) { // In a real app, you'd check the hashed password
          const authenticatedUser: AuthenticatedUser = { ...foundUser, token: `mock-jwt-for-${foundUser.id}` };
          localStorage.setItem('user', JSON.stringify(authenticatedUser));
          setUser(authenticatedUser);
          resolve(authenticatedUser);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const register = async (email: string, pass: string, name: string): Promise<AuthenticatedUser> => {
     return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (MOCK_USERS.some(u => u.email === email)) {
          return reject(new Error('User with this email already exists'));
        }
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          role: UserRole.USER
        };
        MOCK_USERS.push(newUser); // In a real app, this would be a DB call
        const authenticatedUser: AuthenticatedUser = { ...newUser, token: `mock-jwt-for-${newUser.id}` };
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
        resolve(authenticatedUser);
      }, 500);
    });
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
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
