import { API_BASE } from '@/constants/config';
import { Product, CartItem, ApiResponse } from '@/types';

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Fetch single product by ID
export const fetchProduct = async (id: number): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/products/${id}`);
    if (!response.ok) throw new Error('Product not found');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Fetch user cart (authenticated)
export const fetchCart = async (token: string): Promise<CartItem[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/users/me/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    const data = await response.json();
    return data.cart || [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
};

// Update user cart (authenticated)
export const updateCart = async (token: string, cart: CartItem[]): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/users/me/cart`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart }),
    });
    if (!response.ok) throw new Error('Failed to update cart');
    return true;
  } catch (error) {
    console.error('Error updating cart:', error);
    return false;
  }
};

// Health check
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Format price to IDR
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

// Calculate discount percentage
export const calculateDiscount = (price: number, originalPrice: number): number => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};
