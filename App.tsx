
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// User Pages
import UserDashboardPage from './pages/user/UserDashboardPage';
import LearnPage from './pages/user/LearnPage';
import ImprovePage from './pages/user/ImprovePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageContentPage from './pages/admin/ManageContentPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* User Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute role={UserRole.USER}><UserDashboardPage /></ProtectedRoute>} />
            <Route path="/learn" element={<ProtectedRoute role={UserRole.USER}><LearnPage /></ProtectedRoute>} />
            <Route path="/improve" element={<ProtectedRoute role={UserRole.USER}><ImprovePage /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute role={UserRole.ADMIN}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/content" element={<ProtectedRoute role={UserRole.ADMIN}><ManageContentPage /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute role={UserRole.ADMIN}><AnalyticsPage /></ProtectedRoute>} />
            
            {/* Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
