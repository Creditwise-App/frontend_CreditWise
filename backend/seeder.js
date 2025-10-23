const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');
const CreditTip = require('./models/CreditTip');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creditwise', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [
  { email: 'user@example.com', name: 'Ayomide Adebayo', role: 'USER', password: 'password123' },
  { email: 'admin@example.com', name: 'Chidinma Okoro', role: 'ADMIN', password: 'admin123' },
];

const quizzes = [
  {
    title: 'Quiz: What is a Credit Score?',
    questions: [
      { 
        question: 'What is the typical range for a credit score?', 
        options: ['0-100', '300-850', '1000-2000'], 
        correctAnswer: '300-850' 
      },
      { 
        question: 'Which entity calculates credit scores in Nigeria?', 
        options: ['The Central Bank', 'Commercial Banks', 'Credit Bureaus'], 
        correctAnswer: 'Credit Bureaus' 
      }
    ]
  },
  {
    title: 'Quiz: Advantages of Good Credit',
    questions: [
      { 
        question: 'What is a major benefit of a good credit score?', 
        options: ['Higher taxes', 'Lower interest rates on loans', 'Free bank charges'], 
        correctAnswer: 'Lower interest rates on loans' 
      },
    ]
  },
  {
    title: 'Quiz: Credit Score Calculation',
    questions: [
      { 
        question: 'What is the most important factor in calculating your credit score?', 
        options: ['Your age', 'Your income', 'Your payment history'], 
        correctAnswer: 'Your payment history' 
      },
    ]
  },
  {
    title: 'Quiz: Disadvantages of Bad Credit',
    questions: [
      { 
        question: 'A bad credit score can make it harder to do what?', 
        options: ['Open a savings account', 'Rent an apartment', 'Vote in elections'], 
        correctAnswer: 'Rent an apartment' 
      },
    ]
  }
];

const lessons = [
  {
    title: 'What is a Credit Score?',
    content: 'A credit score is a number between 300-850 that depicts a consumer\'s creditworthiness. The higher the score, the better a borrower looks to potential lenders. In Nigeria, credit bureaus like CRC Credit Bureau, CR Services, and XDS Credit Bureau calculate these scores based on your financial history.',
  },
  {
    title: 'Advantages of a Good Credit Score',
    content: 'A good credit score can unlock many financial opportunities, including lower interest rates on loans and credit cards, higher approval chances for credit, more negotiating power, and easier access to services like renting an apartment or getting a phone contract.',
  },
  {
    title: 'How Credit Scores are Calculated in Nigeria',
    content: 'Credit scores in Nigeria are calculated based on several factors: payment history (35%), amounts owed (30%), length of credit history (15%), new credit (10%), and credit mix (10%). Paying bills on time and keeping credit utilization low are key.',
  },
  {
    title: 'Disadvantages of a Bad Credit Score',
    content: 'A bad credit score can lead to loan application rejections, high interest rates, difficulty securing housing, and even impact employment opportunities in some financial sectors. It limits your financial flexibility and can be costly in the long run.',
  }
];

const tips = [
  {
    title: 'Pay Bills on Time',
    description: 'Payment history is the most important factor in your credit score. Always pay at least the minimum amount by the due date.'
  },
  {
    title: 'Keep Credit Utilization Low',
    description: 'Try to use less than 30% of your available credit. For example, if your credit limit is ₦100,000, try to keep your balance below ₦30,000.'
  },
  {
    title: 'Check Your Credit Report Regularly',
    description: 'Review your credit report at least once a year to ensure accuracy and detect any fraudulent activity.'
  },
  {
    title: 'Maintain Old Accounts',
    description: 'The length of your credit history matters. Keep older accounts open, even if you don\'t use them frequently.'
  }
];

const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await CreditTip.deleteMany({});
    
    // Insert users one by one to ensure password hashing middleware is triggered
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log('Users inserted:', createdUsers.length);
    
    // Insert quizzes
    const createdQuizzes = await Quiz.insertMany(quizzes);
    console.log('Quizzes inserted:', createdQuizzes.length);
    
    // Insert lessons without quiz references
    const createdLessons = await Lesson.insertMany(lessons);
    console.log('Lessons inserted:', createdLessons.length);
    
    // Insert tips
    const createdTips = await CreditTip.insertMany(tips);
    console.log('Tips inserted:', createdTips.length);
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();