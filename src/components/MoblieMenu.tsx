// src/components/MobileMenu.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const linkBase = "block px-4 py-2 rounded-md text-sm font-medium transition-colors";
const linkActive = "bg-primary-green text-white";
const linkInactive = "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

export const MobileMenu: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { user } = useAuth();
  if (!open) return null;

  return (
    <div className="md:hidden bg-card-light dark:bg-card-dark border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 pb-4 space-y-1">
        <NavLink to="/" className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} onClick={onClose}>Home</NavLink>

        {user?.role === UserRole.USER && (
          <>
            <NavLink to="/learn" className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} onClick={onClose}>Learn</NavLink>
            <NavLink to="/improve" className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} onClick={onClose}>Improve</NavLink>
            <NavLink to="/dashboard" className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} onClick={onClose}>Dashboard</NavLink>
          </>
        )}

        {user?.role === UserRole.ADMIN && (
          <>
            <NavLink to="/admin/dashboard" className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} onClick={onClose}>Dashboard</NavLink>
            <NavLink to="/admin/content" className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} onClick={onClose}>Manage Content</NavLink>
            <NavLink to="/admin/analytics" className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} onClick={onClose}>Analytics</NavLink>
          </>
        )}
      </div>
    </div>
  );
};
