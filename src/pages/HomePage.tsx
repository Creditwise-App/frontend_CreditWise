
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const FeatureCard: React.FC<{ title: string; description: string; icon: string }> = ({ title, description, icon }) => (
  <Card className="text-center">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-green text-white">
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{description}</p>
  </Card>
);

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
          Take Control of Your <span className="text-primary-green">Financial Future</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          Understand, manage, and improve your credit score with CreditWise. Your journey to financial freedom in Nigeria starts here.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/register">
            <Button variant="primary" className="text-lg px-8 py-3">Get Started</Button>
          </Link>
          <Link to="/learn">
            <Button variant="secondary" className="text-lg px-8 py-3">Learn More</Button>
          </Link>
        </div>
      </div>

      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="🎓"
            title="Educate Yourself" 
            description="Access interactive lessons and quizzes to understand the fundamentals of credit in Nigeria." 
          />
          <FeatureCard 
            icon="🚀"
            title="Create a Plan" 
            description="Input your financial details to generate a personalized debt repayment strategy." 
          />
          <FeatureCard 
            icon="📊"
            title="Track Your Progress" 
            description="Monitor your journey with intuitive dashboards, charts, and motivational reminders." 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
