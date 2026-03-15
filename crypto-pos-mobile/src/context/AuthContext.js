import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  getCompanyAuth,
  getCashierAuth,
  getSession,
  storeCompanyAuth,
  storeCashierAuth,
  storeSession,
  clearAuth,
  clearCashierAuth,
} from '../utils/storage';
import { checkAuthStatus } from '../api/endpoints';

/**
 * Authentication Context
 * Manages authentication state and provides auth methods throughout the app
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [cashier, setCashier] = useState(null);
  const [companyToken, setCompanyToken] = useState(null);
  const [cashierToken, setCashierToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from storage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      // Check for stored authentication
      const companyAuth = await getCompanyAuth();
      const cashierAuth = await getCashierAuth();
      const session = await getSession();

      if (companyAuth.token && cashierAuth.token) {
        // Both company and cashier are logged in
        setCompanyToken(companyAuth.token);
        setCashierToken(cashierAuth.token);
        setCompany(companyAuth.companyData);
        setCashier(cashierAuth.cashierData);
        setIsAuthenticated(true);

        // Verify tokens are still valid (with timeout to prevent hanging)
        try {
          // Add timeout wrapper (3 seconds max) to prevent black screen
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth check timeout')), 3000)
          );
          
          const status = await Promise.race([
            checkAuthStatus(),
            timeoutPromise
          ]);
          
          if (!status.valid) {
            // Tokens expired, clear auth
            await clearAuth();
            setCompany(null);
            setCashier(null);
            setCompanyToken(null);
            setCashierToken(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          // Network error or timeout - don't clear auth, just log it
          // User can still try to use the app, tokens might still be valid
          console.log('Auth check skipped (server unreachable or timeout):', error.message);
          // Keep tokens - they might still be valid, let user try to use app
        }
      } else if (companyAuth.token) {
        // Only company is logged in
        setCompanyToken(companyAuth.token);
        setCompany(companyAuth.companyData);
        setIsAuthenticated(false); // Not fully authenticated yet
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Don't clear auth on initialization errors - let user try to login
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login company
   */
  const loginCompany = async (token, companyData) => {
    try {
      const success = await storeCompanyAuth(token, companyData);
      if (success) {
        setCompanyToken(token);
        setCompany(companyData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in company:', error);
      return false;
    }
  };

  /**
   * Login cashier
   */
  const loginCashier = async (token, cashierData) => {
    try {
      const success = await storeCashierAuth(token, cashierData);
      if (success) {
        setCashierToken(token);
        setCashier(cashierData);
        setIsAuthenticated(true);
        
        // Store complete session
        await storeSession({
          company,
          cashier: cashierData,
          companyToken,
          cashierToken: token,
          timestamp: new Date().toISOString(),
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in cashier:', error);
      return false;
    }
  };

  /**
   * Logout (clear all auth)
   */
  const logout = async () => {
    try {
      await clearAuth();
      setCompany(null);
      setCashier(null);
      setCompanyToken(null);
      setCashierToken(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  };

  /**
   * Logout cashier only (keep company logged in)
   */
  const logoutCashier = async () => {
    try {
      await clearCashierAuth();
      setCashier(null);
      setCashierToken(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Error logging out cashier:', error);
      return false;
    }
  };

  const value = {
    // State
    company,
    cashier,
    companyToken,
    cashierToken,
    loading,
    isAuthenticated,
    isCompanyLoggedIn: !!companyToken,
    isCashierLoggedIn: !!cashierToken,
    
    // Methods
    loginCompany,
    loginCashier,
    logout,
    logoutCashier,
    initializeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
