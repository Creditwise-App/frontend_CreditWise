
import { User, UserRole, Lesson, Quiz } from './types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', email: 'user@example.com', name: 'Ayomide Adebayo', role: UserRole.USER },
  { id: 'admin-1', email: 'admin@example.com', name: 'Chidinma Okoro', role: UserRole.ADMIN },
];

export const MOCK_LESSONS: Lesson[] = [
    {
      id: 'lesson-1',
      title: 'What is a Credit Score?',
      content: 'A credit score is a number between 300-850 that depicts a consumer\'s creditworthiness. The higher the score, the better a borrower looks to potential lenders. In Nigeria, credit bureaus like CRC Credit Bureau, CR Services, and XDS Credit Bureau calculate these scores based on your financial history.',
      quizId: 'quiz-1',
    },
    {
      id: 'lesson-2',
      title: 'Advantages of a Good Credit Score',
      content: 'A good credit score can unlock many financial opportunities, including lower interest rates on loans and credit cards, higher approval chances for credit, more negotiating power, and easier access to services like renting an apartment or getting a phone contract.',
      quizId: 'quiz-2',
    },
    {
      id: 'lesson-3',
      title: 'How Credit Scores are Calculated in Nigeria',
      content: 'Credit scores in Nigeria are calculated based on several factors: payment history (35%), amounts owed (30%), length of credit history (15%), new credit (10%), and credit mix (10%). Paying bills on time and keeping credit utilization low are key.',
      quizId: 'quiz-3',
    },
     {
      id: 'lesson-4',
      title: 'Disadvantages of a Bad Credit Score',
      content: 'A bad credit score can lead to loan application rejections, high interest rates, difficulty securing housing, and even impact employment opportunities in some financial sectors. It limits your financial flexibility and can be costly in the long run.',
      quizId: 'quiz-4',
    }
];

export const MOCK_QUIZZES: Quiz[] = [
    {
        id: 'quiz-1',
        title: 'Quiz: What is a Credit Score?',
        questions: [
            { question: 'What is the typical range for a credit score?', options: ['0-100', '300-850', '1000-2000'], correctAnswer: '300-850' },
            { question: 'Which entity calculates credit scores in Nigeria?', options: ['The Central Bank', 'Commercial Banks', 'Credit Bureaus'], correctAnswer: 'Credit Bureaus' }
        ]
    },
    {
        id: 'quiz-2',
        title: 'Quiz: Advantages of Good Credit',
        questions: [
            { question: 'What is a major benefit of a good credit score?', options: ['Higher taxes', 'Lower interest rates on loans', 'Free bank charges'], correctAnswer: 'Lower interest rates on loans' },
        ]
    },
    {
        id: 'quiz-3',
        title: 'Quiz: Credit Score Calculation',
        questions: [
            { question: 'What is the most important factor in calculating your credit score?', options: ['Your age', 'Your income', 'Your payment history'], correctAnswer: 'Your payment history' },
        ]
    },
     {
        id: 'quiz-4',
        title: 'Quiz: Disadvantages of Bad Credit',
        questions: [
            { question: 'A bad credit score can make it harder to do what?', options: ['Open a savings account', 'Rent an apartment', 'Vote in elections'], correctAnswer: 'Rent an apartment' },
        ]
    }
];
