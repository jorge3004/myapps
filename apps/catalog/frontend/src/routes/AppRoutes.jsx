import React from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { Routes, Route, useLocation } from 'react-router-dom';
import UserManager from '../pages/dashboard/UserManager';
import CatalogManager from '../pages/dashboard/CatalogManager';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardHome from '../pages/dashboard/DashboardHome';
import Login from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

import ForgotPasswordPage from '../pages/ForgotPasswordPage';

import useSimpleAuthRedirect from '../hooks/auth/useAuthRedirect';

import useLastRouteSync from '../hooks/userSession/useLastRouteSync';

import ResetPasswordPage from '../pages/ResetPasswordPage';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Mostrar pantalla de loading si está cargando autenticación
  if (loading) {
    return <LoadingScreen message={t('auth.loading', 'Loading authentication...')} />;
  }

  const redirect = useSimpleAuthRedirect();
  if (redirect) return redirect;

  useLastRouteSync();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot/:user_id?" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/dashboard"
        element={<DashboardLayout />}
      >
        <Route
          path="users"
          element={
            user && user.role === 'admin' ? <UserManager /> : <DashboardHome />
          }
        />
        <Route path="catalog" element={<CatalogManager />} />
        <Route path="" element={<DashboardHome />} />
      </Route>
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
