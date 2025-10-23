
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  currentCreditScore?: number | null;
  targetCreditScore?: number | null;
  extraMonthlyPayment?: number | null;
}

export interface AuthenticatedUser extends User {
  token: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  quizId?: string;
  likes?: number;
  dislikes?: number;
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
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string | null;
  userName?: string | null;
  createdAt: string; // ISO
  preferredDate?: string | null; // ISO string or human text
  answers: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

// API response type for populated appointment
export interface PopulatedAppointment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string | null;
  userName?: string | null;
  createdAt: string; // ISO
  preferredDate?: string | null; // ISO string or human text
  answers: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export interface CreditTip {
  id: string;
  title: string;
  description: string;
  createdAt: string; // ISO
}