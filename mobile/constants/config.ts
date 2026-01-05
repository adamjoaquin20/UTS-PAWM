// API configuration
// Update this URL after deploying backend to Railway
export const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Supabase configuration (for direct client-side auth)
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
