// src/layouts/DashboardLayout.tsx
import React, { ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../../types';
import { Sidebar } from '../SideBar';

export const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
     const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-md ">
               <Sidebar/>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-6">
                <Outlet/>
            </main>
        </div>
    );
};
