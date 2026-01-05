-- =====================================================
-- SUPABASE SETUP FOR AUTOCUAN SUPPLY
-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- =====================================================

-- DROP existing tables if you want fresh start (UNCOMMENT if needed)
-- DROP TABLE IF EXISTS public.carts CASCADE;
-- DROP TABLE IF EXISTS public.orders CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;
-- DROP TABLE IF EXISTS public.products CASCADE;

-- 1. PRODUCTS TABLE
DROP TABLE IF EXISTS public.products CASCADE;
CREATE TABLE public.products (
  id bigint PRIMARY KEY,
  name text NOT NULL,
  brand text,
  category text,
  price integer NOT NULL,
  "originalPrice" integer,
  image text,
  material text,
  sizes jsonb DEFAULT '[]'::jsonb,
  "isHot" boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access on products" ON public.products
  FOR SELECT USING (true);

-- 2. CARTS TABLE (for authenticated users)
CREATE TABLE IF NOT EXISTS public.carts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cart jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Users can only access their own cart
CREATE POLICY "Users can read own cart" ON public.carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart" ON public.carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart" ON public.carts
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow service role to manage carts (for backend)
CREATE POLICY "Service role full access on carts" ON public.carts
  USING (auth.role() = 'service_role');

-- 3. ORDERS TABLE (optional, for checkout)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  items jsonb NOT NULL,
  total integer NOT NULL,
  status text DEFAULT 'pending',
  shipping_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
CREATE POLICY "Users can read own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- 4. USER PROFILES TABLE (optional)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 5. SEED SAMPLE PRODUCTS
-- =====================================================
INSERT INTO public.products (id, name, brand, category, price, "originalPrice", image, material, sizes, "isHot")
VALUES
  (1, 'Air Jordan 1 High Lost And Found', 'Air Jordan', 'jordan', 2500000, 3200000, 'assets/products/Air Jordan 1 High Lost And Found Men.jpg', 'Leather', '[40,41,42,43,44]', true),
  (2, 'Air Jordan 1 Low Panda WMNS', 'Air Jordan', 'jordan', 1800000, 2200000, 'assets/products/Air Jordan 1 Low Panda WMNS.jpg', 'Leather', '[36,37,38,39,40]', false),
  (3, 'Air Jordan 1 Low True Blue Navy', 'Air Jordan', 'jordan', 1900000, 2300000, 'assets/products/Air Jordan 1 Low True Blue Navy.jpg', 'Leather', '[38,39,40,41,42]', false),
  (4, 'Air Jordan 1 Low Wolf Grey WMNS', 'Air Jordan', 'jordan', 2000000, 2500000, 'assets/products/Air Jordan 1 Low Wolf Grey WMNS.jpg', 'Leather', '[36,37,38,39,40]', true),
  (5, 'Nike Dunk Low Black And White', 'Nike', 'nike', 1200000, 1500000, 'assets/products/Nike Dunk Low Black And White Men.jpg', 'Leather', '[39,40,41,42,43,44]', true),
  (6, 'Nike Dunk Low Clear Jade', 'Nike', 'nike', 1250000, 1600000, 'assets/products/Nike Dunk Low Clear Jade.jpg', 'Leather', '[38,39,40,41,42]', false),
  (7, 'Nike Dunk Low Harvest Moon', 'Nike', 'nike', 1300000, 1650000, 'assets/products/Nike Dunk Low Harvest Moon.jpg', 'Leather', '[36,37,38,39,40]', false),
  (8, 'Nike Dunk Low Smoke Grey WMNS', 'Nike', 'nike', 1350000, 1700000, 'assets/products/Nike Dunk Low Smoke Grey WMNS.jpg', 'Leather', '[37,38,39,40,41]', true),
  (9, 'Yeezy Slide Slate Grey', 'Yeezy', 'yeezy', 900000, 1200000, 'assets/products/Yeezy Slide Slate Grey.jpg', 'EVA Foam', '[38,39,40,41,42,43,44]', true),
  (10, 'Adidas Samba OG Cloud White', 'Adidas', 'adidas', 1100000, 1450000, 'assets/products/Adidas Samba OG Cloud White.jpg', 'Leather', '[36,37,38,39,40,41,42,43]', false)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DONE! Your Supabase is now configured.
-- =====================================================
