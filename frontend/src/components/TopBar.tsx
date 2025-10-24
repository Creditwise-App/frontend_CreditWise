
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onToggleDark: () => void;
  isDark: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu, onToggleDark, isDark }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-card-light dark:bg-card-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onOpenMobileMenu} className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800">
            {/* hamburger */}
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-xl font-bold text-primary-green hidden sm:block">CreditWise</div>
        </div>

        <div className="flex items-center gap-3">
          {/* Dark toggle */}
          <button onClick={onToggleDark} aria-label="Toggle dark mode" className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800">
            {isDark ? (
              /* Sun icon */
              <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5a1 1 0 011 1V7a1 1 0 11-2 0V5.5a1 1 0 011-1zM12 17a5 5 0 100-10 5 5 0 000 10zM4.5 12a1 1 0 011-1H7a1 1 0 110 2H5.5a1 1 0 01-1-1zM17 12a1 1 0 011-1h1.5a1 1 0 110 2H18a1 1 0 01-1-1zM6.22 6.22a1 1 0 011.41 0l1.06 1.06a1 1 0 11-1.41 1.41L6.22 7.64a1 1 0 010-1.41zM17.31 17.31a1 1 0 011.41 0l1.06 1.06a1 1 0 11-1.41 1.41l-1.06-1.06a1 1 0 010-1.41zM6.22 17.78a1 1 0 000-1.41l-1.06-1.06a1 1 0 10-1.41 1.41l1.06 1.06a1 1 0 001.41 0zM17.31 6.69a1 1 0 000-1.41l-1.06-1.06a1 1 0 10-1.41 1.41l1.06 1.06a1 1 0 001.41 0z" /></svg>
            ) : (
              /* Moon icon */
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="text-sm hidden sm:block">{user.name}</div>
              <button onClick={handleLogout} className="px-3 py-1 rounded-md bg-primary-blue text-white text-sm">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/login')} className="px-3 py-1 rounded-md text-sm">Login</button>
              <button onClick={() => navigate('/register')} className="px-3 py-1 rounded-md bg-primary-blue text-white text-sm">Register</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
