import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';
import { useAuth } from '../context/AuthContext';

const linkBase = "block px-3 py-2 rounded-md text-sm font-medium transition-colors";
const linkActive = "bg-primary-green text-white";
const linkInactive = "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  console.log("CURRENT USER:", user);
  return (
    <aside className="flex flex-col w-64 fixed inset-y-0 bg-card-light dark:bg-card-dark border-r border-gray-200 dark:border-gray-700 p-4">
      <div className="mb-6">
        <NavLink to="/" className="text-2xl font-bold text-primary-green">CreditWise</NavLink>
      </div>

      
      <nav className="flex-1 space-y-1">
        

        {user?.role === UserRole.USER && (
          <>
            <NavLink to="/learn" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>Learn</NavLink>
            <NavLink to="/improve" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>Improve</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>Dashboard</NavLink>
          </>
        )}

        {user?.role === UserRole.ADMIN && (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>Dashboard</NavLink>
            <NavLink to="/admin/content" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>Manage Content</NavLink>
            <NavLink to="/admin/analytics" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>Analytics</NavLink>
            <NavLink to="/admin/appointments" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
      Appointments
    </NavLink>
          </>
        )}
      </nav>

     {user && (
                            <button onClick={handleLogout} className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition mt-4">
                                Logout
                            </button>
                        ) }

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">© CreditWise</p>
      </div>
    </aside>
  );
};
