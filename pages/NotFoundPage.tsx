
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-6xl font-extrabold text-primary-green">404</h1>
      <h2 className="text-3xl font-bold mt-2">Page Not Found</h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link to="/" className="mt-8">
        <Button>Go Back Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
