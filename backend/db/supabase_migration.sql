-- Supabase / Postgres migration for products table
-- Run this in Supabase SQL editor or psql to create table and seed sample data

CREATE TABLE IF NOT EXISTS public.products (
  id bigint PRIMARY KEY,
  name text,
  brand text,
  category text,
  price integer,
  originalPrice integer,
  image text,
  material text,
  sizes jsonb,
  isHot boolean DEFAULT false,
  description text
);

-- Sample inserts (adapt or import via CSV)
INSERT INTO public.products (id,name,brand,category,price,originalPrice,image,material,sizes,isHot)
VALUES
(1,'Air Jordan 1 High Lost And Found','Air Jordan','jordan',2500000,3200000,'assets/products/Air Jordan 1 High Lost And Found Men.jpg','Leather','[40,41,42,43,44]',true),
(2,'Air Jordan 1 Low Panda WMNS','Air Jordan','jordan',1800000,2200000,'assets/products/Air Jordan 1 Low Panda WMNS.jpg','Leather','[36,37,38,39,40]',false),
(3,'Air Jordan 1 Low True Blue Navy','Air Jordan','jordan',1900000,2300000,'assets/products/Air Jordan 1 Low True Blue Navy.jpg','Leather','[38,39,40,41,42]',false),
(4,'Air Jordan 1 Low Wolf Grey WMNS','Air Jordan','jordan',2000000,2500000,'assets/products/Air Jordan 1 Low Wolf Grey WMNS.jpg','Leather','[36,37,38,39,40]',true),
(5,'Nike Dunk Low Black And White','Nike','nike',1200000,1500000,'assets/products/Nike Dunk Low Black And White Men.jpg','Leather','[39,40,41,42,43,44]',true),
(6,'Nike Dunk Low Clear Jade','Nike','nike',1250000,1600000,'assets/products/Nike Dunk Low Clear Jade.jpg','Leather','[38,39,40,41,42]',false),
(7,'Nike Dunk Low Harvest Moon','Nike','nike',1300000,1650000,'assets/products/Nike Dunk Low Harvest Moon.jpg','Leather','[36,37,38,39,40]',false),
(8,'Nike Dunk Low Smoke Grey WMNS','Nike','nike',1350000,1700000,'assets/products/Nike Dunk Low Smoke Grey WMNS.jpg','Leather','[37,38,39,40,41]',true),
(9,'Yeezy Slide Slate Grey','Yeezy','yeezy',900000,1200000,'assets/products/Yeezy Slide Slate Grey.jpg','EVA Foam','[38,39,40,41,42,43,44]',true),
(10,'Adidas Samba OG Cloud White','Adidas','adidas',1100000,1450000,'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nike%20Dunk%20Low%20Black%20And%20White%20Men-WVq6AxLA0fnUHUM6XCskmdhnUiCzyX.jpg','Leather','[36,37,38,39,40,41,42,43]',false)
ON CONFLICT (id) DO NOTHING;
