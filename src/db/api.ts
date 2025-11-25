import { supabase } from './supabase';
import type { Profile, MenuItem, Order, Discount } from '@/types/types';

export const profilesApi = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data as Profile | null;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as Profile;
  },

  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }
};

export const menuApi = {
  async getAllMenuItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getMenuItemsByCategory(category: string) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(item)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as MenuItem;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>) {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as MenuItem;
  },

  async deleteMenuItem(id: string) {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const ordersApi = {
  async createOrder(orderData: {
    user_id: string | null;
    customer_name: string;
    customer_mobile: string;
    table_number: string | null;
    items: Array<{ id: string; name: string; price: number; quantity: number; image_url?: string }>;
    subtotal: number;
    discount_amount: number;
    total_amount: number;
    currency: string;
  }) {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        customer_name: orderData.customer_name,
        customer_mobile: orderData.customer_mobile,
        table_number: orderData.table_number,
        items: orderData.items,
        subtotal: orderData.subtotal,
        discount_amount: orderData.discount_amount,
        total_amount: orderData.total_amount,
        currency: orderData.currency,
        status: 'received',
      })
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getOrderById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();
    
    if (error) throw error;
    return data as Order | null;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as Order;
  }
};

export const discountsApi = {
  async getActiveDiscounts() {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('active', true)
      .order('min_spending', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getAllDiscounts() {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .order('min_spending', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createDiscount(discount: Omit<Discount, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('discounts')
      .insert(discount)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as Discount;
  },

  async updateDiscount(id: string, updates: Partial<Discount>) {
    const { data, error } = await supabase
      .from('discounts')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as Discount;
  },

  async deleteDiscount(id: string) {
    const { error } = await supabase
      .from('discounts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  calculateDiscount(totalSpent: number, discounts: Discount[]): { discount: Discount | null; amount: number } {
    const applicableDiscount = discounts.find(d => totalSpent >= d.min_spending);
    
    if (!applicableDiscount) {
      return { discount: null, amount: 0 };
    }
    
    return {
      discount: applicableDiscount,
      amount: applicableDiscount.discount_percentage
    };
  }
};
