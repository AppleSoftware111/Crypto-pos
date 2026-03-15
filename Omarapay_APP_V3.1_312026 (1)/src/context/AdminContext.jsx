import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isAuthorizedAdmin } from '@/config/adminConfig';
import { logAdminAction } from '@/lib/adminActionLogger';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { walletAddress, isConnected } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Verify Admin Status
  useEffect(() => {
    const checkAuthorization = async () => {
      setIsChecking(true);
      if (isConnected && walletAddress) {
        const authorized = isAuthorizedAdmin(walletAddress);
        setIsAdmin(authorized);
      } else {
        setIsAdmin(false);
      }
      setIsChecking(false);
    };

    checkAuthorization();
  }, [isConnected, walletAddress]);

  // Log login events
  useEffect(() => {
    if (isAdmin && walletAddress) {
        const lastLog = sessionStorage.getItem('omara_admin_login_logged');
        if (!lastLog) {
            logAdminAction(walletAddress, 'ADMIN_SESSION_START', { method: 'web3_whitelist' });
            sessionStorage.setItem('omara_admin_login_logged', 'true');
        }
    } else {
        sessionStorage.removeItem('omara_admin_login_logged');
    }
  }, [isAdmin, walletAddress]);

  const value = useMemo(() => ({
    isAdmin,
    isChecking,
    adminAddress: walletAddress,
    verifyAuthorization: () => isAuthorizedAdmin(walletAddress)
  }), [isAdmin, isChecking, walletAddress]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};