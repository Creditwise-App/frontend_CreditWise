import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../../types';
import { MobileMenu } from '../MobileMenu';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const baseLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeLinkClasses = "bg-primary-green text-white";
    const inactiveLinkClasses = "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";

    const getLinkClass = ({ isActive }: { isActive: boolean }) => 
        `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`;

    return (
        <>
            <nav className="bg-card-light dark:bg-card-dark shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <NavLink to="/" className="text-2xl font-bold text-primary-green">
                                CreditWise
                            </NavLink>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/" className={getLinkClass}>Home</NavLink>
                                {user?.role === UserRole.USER && (
                                    <>
                                        <NavLink to="/learn" className={getLinkClass}>Learn</NavLink>
                                        <NavLink to="/improve" className={getLinkClass}>Improve</NavLink>
                                        <NavLink to="/dashboard" className={getLinkClass}>Dashboard</NavLink>
                                    </>
                                )}
                                {user?.role === UserRole.ADMIN && (
                                    <>
                                        <NavLink to="/admin/dashboard" className={getLinkClass}>Dashboard</NavLink>
                                        <NavLink to="/admin/content" className={getLinkClass}>Manage Content</NavLink>
                                        <NavLink to="/admin/analytics" className={getLinkClass}>Analytics</NavLink>
                                        <NavLink to="/admin/appointments" className={getLinkClass}>Appointments</NavLink>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="hidden md:block">
                            {user ? (
                                <button onClick={handleLogout} className={`${baseLinkClasses} ${inactiveLinkClasses}`}>
                                    Logout
                                </button>
                            ) : (
                                <div className="space-x-2">
                                    <NavLink to="/login" className={getLinkClass}>Login</NavLink>
                                    <NavLink to="/register" className={`${baseLinkClasses} bg-primary-blue text-white hover:bg-blue-600`}>Register</NavLink>
                                </div>
                            )}
                        </div>
                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                {mobileMenuOpen ? (
                                    // Close icon
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    // Hamburger icon
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
};

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
                    <Outlet/>
                </div>
            </main>
        </div>
    );
};