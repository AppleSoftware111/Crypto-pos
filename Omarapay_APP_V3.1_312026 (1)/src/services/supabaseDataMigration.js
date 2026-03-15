// Service deprecated/removed as part of Supabase removal.

export const migrateData = async () => {
  console.warn("Supabase migration is disabled.");
  return { success: true };
};

export const syncUserData = async () => {
  return { success: true };
};