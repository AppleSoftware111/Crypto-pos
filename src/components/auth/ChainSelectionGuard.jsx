import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLoadingScreen from './AuthLoadingScreen';

const ChainSelectionGuard = ({ children }) => {
  const { isConnected, selectedBlockchain, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  // 1. Must be authenticated first
  if (!isConnected) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Must have a chain selected
  if (!selectedBlockchain) {
    return <Navigate to="/chain-selection" state={{ from: location }} replace />;
  }

  return children;
};

export default ChainSelectionGuard;