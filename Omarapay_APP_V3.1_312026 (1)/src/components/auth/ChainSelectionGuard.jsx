import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLoadingScreen from './AuthLoadingScreen';

const ChainSelectionGuard = ({ children }) => {
  const { isConnected, selectedBlockchain, currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  // 1. Must be authenticated (wallet connected OR session user e.g. Google/email)
  const isAuthenticated = isConnected || currentUser;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Wallet users must have a chain selected; non-wallet users (Google/email) can proceed
  if (isConnected && !selectedBlockchain) {
    return <Navigate to="/chain-selection" state={{ from: location }} replace />;
  }

  return children;
};

export default ChainSelectionGuard;