import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const MasterFranchisePrivateRoute = ({ children }) => {
  const { isMasterFranchiseAuthenticated, loading, currentUser, impersonatingFrom } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><div>Loading...</div></div>;
  }
  
  const isAuthenticated = isMasterFranchiseAuthenticated || (impersonatingFrom && currentUser?.role === 'MasterFranchise');

  if (!isAuthenticated) {
    return <Navigate to="/master-franchise/login" state={{ from: location }} replace />;
  }
  
  if (currentUser?.role !== 'MasterFranchise') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default MasterFranchisePrivateRoute;