// File deprecated/removed as part of Supabase removal.
// Authentication is now handled via AuthContext using localStorage/Wallet.

export const useSupabaseAuth = () => {
  return {
    session: null,
    user: null,
    loading: false,
    signUp: async () => ({ error: null, data: {} }),
    signIn: async () => ({ error: null, data: {} }),
    signOut: async () => ({ error: null }),
    resetPassword: async () => ({ error: null })
  };
};