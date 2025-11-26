/*
# Create Initial Schema for RQEAT Ordering System

## Plain English Explanation
This migration sets up the complete database structure for the RQEAT online ordering system, including user profiles, menu items, orders, and discount management.

## Table List & Column Descriptions

### 1. user_role (ENUM)
- Defines user roles: 'user' and 'admin'

### 2. profiles
- `id` (uuid, primary key, references auth.users): User identifier
- `username` (text, unique, not null): Username for login
- `name` (text, not null): Customer's full name
- `mobile` (text, not null): Customer's mobile number
- `table_number` (text): Table number for dine-in orders
- `role` (user_role, default 'user'): User role
- `total_spent` (numeric, default 0): Total amount spent by customer
- `created_at` (timestamptz, default now()): Account creation timestamp

### 3. menu_category (ENUM)
- Defines menu categories: 'Starter', 'Main Course', 'Dessert', 'Fast Food'

### 4. menu_items
- `id` (uuid, primary key): Menu item identifier
- `name` (text, not null): Item name
- `description` (text): Item description
- `price` (numeric, not null): Item price
- `category` (menu_category, not null): Item category
- `image_url` (text): Item image URL
- `available` (boolean, default true): Availability status
- `created_at` (timestamptz, default now()): Creation timestamp
- `updated_at` (timestamptz, default now()): Last update timestamp

### 5. order_status (ENUM)
- Defines order statuses: 'pending', 'received', 'preparing', 'delivered', 'completed', 'cancelled'

### 6. orders
- `id` (uuid, primary key): Order identifier
- `user_id` (uuid, references profiles): Customer who placed the order
- `customer_name` (text, not null): Customer name
- `customer_mobile` (text, not null): Customer mobile number
- `table_number` (text): Table number
- `items` (jsonb, not null): Order items details
- `subtotal` (numeric, not null): Subtotal before discount
- `discount_amount` (numeric, default 0): Applied discount amount
- `total_amount` (numeric, not null): Final total after discount
- `currency` (text, default 'usd'): Currency code
- `status` (order_status, default 'pending'): Order status
- `stripe_session_id` (text, unique): Stripe checkout session ID
- `stripe_payment_intent_id` (text): Stripe payment intent ID
- `customer_email` (text): Customer email from Stripe
- `completed_at` (timestamptz): Order completion timestamp
- `created_at` (timestamptz, default now()): Order creation timestamp
- `updated_at` (timestamptz, default now()): Last update timestamp

### 7. discounts
- `id` (uuid, primary key): Discount identifier
- `name` (text, not null): Discount name
- `description` (text): Discount description
- `min_spending` (numeric, not null): Minimum spending required
- `discount_percentage` (numeric, not null): Discount percentage (0-100)
- `active` (boolean, default true): Active status
- `created_at` (timestamptz, default now()): Creation timestamp

## Security Changes
- RLS enabled on all tables
- Profiles: Users can view their own profile; admins have full access
- Menu items: Public read access; admins can manage
- Orders: Users can view their own orders; admins have full access
- Discounts: Public read access; admins can manage
- Helper function `is_admin` to check admin role
- Trigger to auto-create profile for new users (first user becomes admin)
- Trigger to update total_spent when order is completed

## Notes
- First registered user automatically becomes admin
- Order status flow: pending → received → preparing → delivered → completed
- Discounts are automatically calculated based on customer's total spending
- All monetary values use numeric type for precision
*/

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE menu_category AS ENUM ('Starter', 'Main Course', 'Dessert', 'Fast Food');
CREATE TYPE order_status AS ENUM ('pending', 'received', 'preparing', 'delivered', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  mobile text NOT NULL,
  table_number text,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  total_spent numeric(12,2) DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  category menu_category NOT NULL,
  image_url text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  customer_name text NOT NULL,
  customer_mobile text NOT NULL,
  table_number text,
  items jsonb NOT NULL,
  subtotal numeric(12,2) NOT NULL,
  discount_amount numeric(12,2) DEFAULT 0,
  total_amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'usd',
  status order_status DEFAULT 'pending'::order_status NOT NULL,
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  customer_email text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create discounts table
CREATE TABLE IF NOT EXISTS discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  min_spending numeric(12,2) NOT NULL CHECK (min_spending >= 0),
  discount_percentage numeric(5,2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_discounts_active ON discounts(active);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) 
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for menu_items
CREATE POLICY "Anyone can view available menu items" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage menu items" ON menu_items
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to orders" ON orders
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Service role can manage orders" ON orders
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- RLS Policies for discounts
CREATE POLICY "Anyone can view active discounts" ON discounts
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage discounts" ON discounts
  FOR ALL USING (is_admin(auth.uid()));

-- Trigger to create profile for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  extracted_username text;
BEGIN
  IF OLD IS DISTINCT FROM NULL AND OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL THEN
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    -- Extract username from email (remove @miaoda.com)
    extracted_username := REPLACE(NEW.email, '@miaoda.com', '');
    
    INSERT INTO profiles (id, username, name, mobile, role)
    VALUES (
      NEW.id,
      extracted_username,
      extracted_username,
      COALESCE(NEW.phone, ''),
      CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Trigger to update total_spent when order is completed
CREATE OR REPLACE FUNCTION update_total_spent()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed'::order_status AND OLD.status != 'completed'::order_status THEN
    UPDATE profiles
    SET total_spent = total_spent + NEW.total_amount
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_completed ON orders;
CREATE TRIGGER on_order_completed
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_total_spent();

-- Insert default discounts
INSERT INTO discounts (name, description, min_spending, discount_percentage, active) VALUES
  ('Bronze Tier', '5% off for customers who spent $50+', 50, 5, true),
  ('Silver Tier', '10% off for customers who spent $100+', 100, 10, true),
  ('Gold Tier', '15% off for customers who spent $200+', 200, 15, true),
  ('Platinum Tier', '20% off for customers who spent $500+', 500, 20, true);
