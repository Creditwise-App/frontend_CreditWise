// src/layouts/DashboardLayout.tsx
import React, { useState, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../SideBar';
import { Topbar } from '../TopBar';

export const DashboardLayout: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const toggleDarkMode = () => {
        setIsDark(!isDark);
        // In a real app, you would also update the actual theme
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar - hidden on mobile by default, shown when sidebarOpen is true */}
            <aside 
                className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:flex md:flex-shrink-0`}
            >
                <Sidebar />
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <Topbar 
                    onOpenMobileMenu={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                
                {/* Content Area */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    {children}
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};