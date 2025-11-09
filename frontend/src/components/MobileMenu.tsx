import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../../types';
import { useAppointments } from '../context/AppointmentContext';

const linkBase = "block px-4 py-3 rounded-md text-base font-medium transition-colors";
const linkActive = "bg-primary-green text-white";
const linkInactive = "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

export const MobileMenu: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getPendingCount } = useAppointments();
  const pendingCount = getPendingCount();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  if (!open) return null;

  return (
    <div className="md:hidden bg-card-light dark:bg-card-dark border-b border-gray-200 dark:border-gray-700">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <NavLink 
          to="/" 
          className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} 
          onClick={onClose}
        >
          Home
        </NavLink>

        {user?.role === UserRole.USER && (
          <>
            <NavLink 
              to="/learn" 
              className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} 
              onClick={onClose}
            >
              Learn
            </NavLink>
            <NavLink 
              to="/improve" 
              className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} 
              onClick={onClose}
            >
              Improve
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} 
              onClick={onClose}
            >
              Dashboard
            </NavLink>
          </>
        )}

        {user?.role === UserRole.ADMIN && (
          <>
            <NavLink 
              to="/admin/dashboard" 
              className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} 
              onClick={onClose}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/admin/content" 
              className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} 
              onClick={onClose}
            >
              Manage Content
            </NavLink>
            <NavLink 
              to="/admin/analytics" 
              className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} 
              onClick={onClose}
            >
              Analytics
            </NavLink>
            <NavLink 
              to="/admin/appointments" 
              className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} 
              onClick={onClose}
            >
              Appointments {pendingCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          </>
        )}

        {user ? (
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        ) : (
          <div className="space-y-2 pt-2">
            <NavLink 
              to="/login" 
              className={({isActive}) => `${linkBase} ${isActive ? linkActive : linkInactive}`} 
              onClick={onClose}
            >
              Login
            </NavLink>
            <NavLink 
              to="/register" 
              className={`${linkBase} bg-primary-blue text-white hover:bg-blue-600`}
              onClick={onClose}
            >
              Register
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};