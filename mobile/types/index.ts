// Product type definition
export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  material: string;
  sizes: number[];
  isHot: boolean;
  description?: string;
}

// Cart item type
export interface CartItem {
  id: number;
  qty: number;
  size?: number;
  condition?: string;
}

// User type
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

// Auth state
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Category filter
export type CategoryFilter = 'all' | 'jordan' | 'nike' | 'adidas' | 'yeezy';

// Order status
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress?: string;
}
