import React, { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem('omaraAdminAuthenticated');
        setIsAuthenticated(authStatus === 'true');
      } catch (e) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (password) => {
    if (password === 'admin123') { // This is a temporary, insecure password.
      try {
        localStorage.setItem('omaraAdminAuthenticated', 'true');
      } catch(e) {
        console.error("Could not save auth status to local storage");
      }
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    try {
      localStorage.removeItem('omaraAdminAuthenticated');
    } catch (e) {
      console.error("Could not remove auth status from local storage");
    }
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout, loading };
};

export default useAuth;