// API configuration
// Update this URL after deploying backend to Railway
export const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://uas-pawm.railway.app';

// Supabase configuration (for direct client-side auth)
// Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const IS_SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
