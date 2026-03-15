import React, { createContext, useContext, useMemo } from 'react';

// Context stubbed out as Supabase has been removed.
// Use src/context/AuthContext.jsx instead.

const AuthContext = createContext({
  user: null,
  session: null,
  loading: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const value = useMemo(() => ({
    user: null,
    session: null,
    loading: false,
    signUp: async () => ({ error: { message: "Supabase is disabled" } }),
    signIn: async () => ({ error: { message: "Supabase is disabled" } }),
    signOut: async () => ({ error: null }),
  }), []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};