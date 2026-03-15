import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLoadingScreen from './AuthLoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { isConnected, isAdminAuthenticated, loading, currentUser } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  // Check if authenticated via Wallet (isConnected) OR Email (isAdminAuthenticated)
  const isAuthenticated = isConnected || isAdminAuthenticated || currentUser;

  if (!isAuthenticated) {
    // Redirect to login, saving the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;