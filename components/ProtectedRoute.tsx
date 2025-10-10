
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  // Fix: Changed JSX.Element to React.ReactElement to resolve namespace error.
  children: React.ReactElement;
  role: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-green"></div>
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location, message: 'You must log in to view this page.' }} replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/login" state={{ from: location, message: 'Access Denied: You do not have permission to view this page.' }} replace />;
  }

  return children;
};
