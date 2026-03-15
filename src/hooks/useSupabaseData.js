// File deprecated/removed as part of Supabase removal.
// Data fetching is now handled via localStorage services.

export const useSupabaseProfile = () => ({ profile: null, loading: false, error: null });
export const useSupabaseBusiness = () => ({ business: null, loading: false, error: null });
export const useSupabaseTransactions = () => ({ transactions: [], loading: false, error: null, refresh: () => {} });