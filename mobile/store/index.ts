import { create } from 'zustand';
import { Product, CartItem, User, CategoryFilter } from '@/types';
import { fetchProducts, fetchCart, updateCart } from '@/lib/api';
import { supabase, signIn, signUp, signOut, getSession } from '@/lib/supabase';
import * as SecureStore from 'expo-secure-store';

// Auth Store
interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const { session } = await getSession();
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
          },
          token: session.access_token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    const { data, error } = await signIn(email, password);
    if (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
    if (data.user && data.session) {
      set({
        user: { id: data.user.id, email: data.user.email || '' },
        token: data.session.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
    set({ isLoading: false });
    return { success: false, error: 'Login failed' };
  },

  register: async (email, password) => {
    set({ isLoading: true });
    const { data, error } = await signUp(email, password);
    if (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
    if (data.user) {
      set({ isLoading: false });
      return { success: true };
    }
    set({ isLoading: false });
    return { success: false, error: 'Registration failed' };
  },

  logout: async () => {
    await signOut();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

// Products Store
interface ProductsStore {
  products: Product[];
  filteredProducts: Product[];
  currentFilter: CategoryFilter;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
  setFilter: (filter: CategoryFilter) => void;
  setSearchQuery: (query: string) => void;
  getProductById: (id: number) => Product | undefined;
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  filteredProducts: [],
  currentFilter: 'all',
  searchQuery: '',
  isLoading: false,
  error: null,

  loadProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await fetchProducts();
      set({ products, filteredProducts: products, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load products', isLoading: false });
    }
  },

  setFilter: (filter) => {
    const { products, searchQuery } = get();
    let filtered = filter === 'all' 
      ? products 
      : products.filter(p => p.category === filter);
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    set({ currentFilter: filter, filteredProducts: filtered });
  },

  setSearchQuery: (query) => {
    const { products, currentFilter } = get();
    let filtered = currentFilter === 'all' 
      ? products 
      : products.filter(p => p.category === currentFilter);
    
    if (query) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    set({ searchQuery: query, filteredProducts: filtered });
  },

  getProductById: (id) => {
    return get().products.find(p => p.id === id);
  },
}));

// Cart Store
interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  loadCart: (token?: string) => Promise<void>;
  addItem: (productId: number, qty?: number, size?: number, condition?: string) => void;
  removeItem: (productId: number, size?: number, condition?: string) => void;
  updateQuantity: (productId: number, qty: number, size?: number, condition?: string) => void;
  clearCart: () => void;
  syncCart: (token: string) => Promise<void>;
  getItemCount: () => number;
  getTotal: (products: Product[]) => number;
}

const CART_STORAGE_KEY = 'autocuan_cart';

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,

  loadCart: async (token?) => {
    set({ isLoading: true });
    try {
      if (token) {
        // Load from server
        const items = await fetchCart(token);
        set({ items, isLoading: false });
      } else {
        // Load from local storage
        const stored = await SecureStore.getItemAsync(CART_STORAGE_KEY);
        if (stored) {
          set({ items: JSON.parse(stored), isLoading: false });
        } else {
          set({ isLoading: false });
        }
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addItem: (productId, qty = 1, size, condition) => {
    const { items } = get();
    const existingIndex = items.findIndex(item => 
      item.id === productId && 
      item.size === size && 
      item.condition === condition
    );

    let newItems: CartItem[];
    if (existingIndex >= 0) {
      newItems = items.map((item, idx) => 
        idx === existingIndex 
          ? { ...item, qty: item.qty + qty }
          : item
      );
    } else {
      newItems = [...items, { id: productId, qty, size, condition }];
    }

    set({ items: newItems });
    SecureStore.setItemAsync(CART_STORAGE_KEY, JSON.stringify(newItems));
  },

  removeItem: (productId, size, condition) => {
    const { items } = get();
    const newItems = items.filter(item => 
      !(item.id === productId && item.size === size && item.condition === condition)
    );
    set({ items: newItems });
    SecureStore.setItemAsync(CART_STORAGE_KEY, JSON.stringify(newItems));
  },

  updateQuantity: (productId, qty, size, condition) => {
    const { items } = get();
    const newItems = qty > 0
      ? items.map(item => 
          item.id === productId && item.size === size && item.condition === condition
            ? { ...item, qty }
            : item
        )
      : items.filter(item => 
          !(item.id === productId && item.size === size && item.condition === condition)
        );
    
    set({ items: newItems });
    SecureStore.setItemAsync(CART_STORAGE_KEY, JSON.stringify(newItems));
  },

  clearCart: () => {
    set({ items: [] });
    SecureStore.deleteItemAsync(CART_STORAGE_KEY);
  },

  syncCart: async (token) => {
    const { items } = get();
    await updateCart(token, items);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.qty, 0);
  },

  getTotal: (products) => {
    return get().items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
  },
}));
