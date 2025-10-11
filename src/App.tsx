import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from '../types';

// Public Pages
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
        <Routes>

          {/* 🌍 PUBLIC LAYOUT */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* 👤 USER DASHBOARD LAYOUT */}
          <Route element={<ProtectedRoute role={UserRole.USER}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/improve" element={<ImprovePage />} />
          </Route>

          {/* 🛡️ ADMIN DASHBOARD LAYOUT */}
          <Route element={<ProtectedRoute role={UserRole.ADMIN}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/content" element={<ManageContentPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
          </Route>

          {/* 404 PAGE */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
