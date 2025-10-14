
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthenticatedUser extends User {
  token: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  quizId: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  interestRate: number; // Annual percentage rate
}

export interface RepaymentStep {
  month: number;
  payment: number;
  remainingBalance: number;
  debtName: string;
}

export enum RepaymentStrategy {
    SNOWBALL = 'SNOWBALL',
    AVALANCHE = 'AVALANCHE'
}

// src/types.ts (append)
export interface Appointment {
  id: string;
  userId: string | null;
  userName?: string | null;
  createdAt: string; // ISO
  preferredDate?: string | null; // ISO string or human text
  answers: Record<string, any>;
  status: 'pending' | 'approved' | 'completed';
}


export interface CreditTip {
  id: string;
  title: string;
  description: string;
  createdAt: string; // ISO
}