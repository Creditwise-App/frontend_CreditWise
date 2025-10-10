
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
