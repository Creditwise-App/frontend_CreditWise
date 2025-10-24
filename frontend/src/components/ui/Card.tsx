
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-card-light dark:bg-card-dark rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${className}`}>
      {children}
    </div>
  );
};
