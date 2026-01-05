// API configuration
// Update this URL after deploying backend to Railway
export const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://uas-pawm.railway.app';

// Web frontend URL for assets (update after deploying to Vercel)
// For development, we'll use placeholder images until deployed
export const WEB_BASE = process.env.EXPO_PUBLIC_WEB_URL || '';

// Supabase configuration (for direct client-side auth)
// Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const IS_SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Brand-specific placeholder images (shoes)
const PLACEHOLDER_IMAGES: Record<string, string> = {
  'jordan': 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400',
  'nike': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  'yeezy': 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=400',
  'adidas': 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400',
  'default': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
};

// Helper to get full image URL
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return PLACEHOLDER_IMAGES.default;
  if (imagePath.startsWith('http')) return imagePath;
  
  // If WEB_BASE is set, use it
  if (WEB_BASE) {
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const encodedPath = cleanPath.split('/').map(part => encodeURIComponent(part)).join('/');
    return `${WEB_BASE}/${encodedPath}`;
  }
  
  // Otherwise, use placeholder based on brand in the image name
  const lowerPath = imagePath.toLowerCase();
  if (lowerPath.includes('jordan')) return PLACEHOLDER_IMAGES.jordan;
  if (lowerPath.includes('nike') || lowerPath.includes('dunk')) return PLACEHOLDER_IMAGES.nike;
  if (lowerPath.includes('yeezy')) return PLACEHOLDER_IMAGES.yeezy;
  if (lowerPath.includes('adidas')) return PLACEHOLDER_IMAGES.adidas;
  
  return PLACEHOLDER_IMAGES.default;
};
