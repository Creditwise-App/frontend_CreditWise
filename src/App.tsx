import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// All Providers go here (ONLY here)
import { AuthProvider } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { CreditTipsProvider } from './context/CreditTipsContext';

import { Layout } from './components/layout/Layout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from '../types';

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
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';
import AdminAppointmentDetail from './pages/admin/AdminAppointmentDetail';
import { LessonsProvider } from './context/LessonsContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppointmentProvider>
        <CreditTipsProvider>
          <LessonsProvider>
          <HashRouter>
            <Routes>

              {/* Public Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* User Dashboard */}
              <Route element={<ProtectedRoute role={UserRole.USER}><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<UserDashboardPage />} />
                <Route path="/learn" element={<LearnPage />} />
                <Route path="/improve" element={<ImprovePage />} />
              </Route>

              {/* Admin Dashboard */}
              <Route element={<ProtectedRoute role={UserRole.ADMIN}><DashboardLayout /></ProtectedRoute>}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/content" element={<ManageContentPage />} />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
                <Route path="/admin/appointments/:id" element={<AdminAppointmentDetail />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />

            </Routes>
          </HashRouter>
          </LessonsProvider>
        </CreditTipsProvider>
      </AppointmentProvider>
    </AuthProvider>
  );
};

export default App;
