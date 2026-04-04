import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

function normalizeRole(value: unknown): string {
  if (value == null) return '';
  return String(value).trim().toUpperCase();
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const location = useLocation();

  if (!isInitialized) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const role = normalizeRole(user?.role);
  if (role !== 'ADMIN' && role !== 'MODERATOR') {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
};

export default AdminRoute;
