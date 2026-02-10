import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Protect routes that require authentication.
 * Replace with real auth check (token, user context).
 */
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = true; // TODO: use auth store/context

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
