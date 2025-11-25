export type UserRole = 'user' | 'admin';
export type MenuCategory = 'Starter' | 'Main Course' | 'Dessert' | 'Fast Food';
export type OrderStatus = 'pending' | 'received' | 'preparing' | 'delivered' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  username: string;
  name: string;
  mobile: string;
  table_number: string | null;
  role: UserRole;
  total_spent: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: MenuCategory;
  image_url: string | null;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_mobile: string;
  table_number: string | null;
  items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  customer_email: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Discount {
  id: string;
  name: string;
  description: string | null;
  min_spending: number;
  discount_percentage: number;
  active: boolean;
  created_at: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
