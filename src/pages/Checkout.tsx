import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { discountsApi, ordersApi, profilesApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Tag } from 'lucide-react';
import type { Discount } from '@/types/types';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [applicableDiscount, setApplicableDiscount] = useState<Discount | null>(null);

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    mobile: profile?.mobile || '',
    tableNumber: profile?.table_number || '',
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
    loadDiscounts();
  }, [items, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        mobile: profile.mobile,
        tableNumber: profile.table_number || '',
      });
    }
  }, [profile]);

  const loadDiscounts = async () => {
    try {
      const data = await discountsApi.getActiveDiscounts();
      setDiscounts(data);
      
      if (profile) {
        const applicable = data.find(d => profile.total_spent >= d.min_spending);
        setApplicableDiscount(applicable || null);
      }
    } catch (error) {
      console.error('Failed to load discounts:', error);
    }
  };

  const discountAmount = applicableDiscount
    ? (subtotal * applicableDiscount.discount_percentage) / 100
    : 0;
  const total = subtotal - discountAmount;

  const handlePlaceOrder = async () => {
    if (!formData.name.trim() || !formData.mobile.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        user_id: user?.id || null,
        customer_name: formData.name,
        customer_mobile: formData.mobile,
        table_number: formData.tableNumber || null,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url || undefined,
        })),
        subtotal: subtotal,
        discount_amount: discountAmount,
        total_amount: total,
        currency: 'INR',
      };

      const order = await ordersApi.createOrder(orderData);

      if (user && profile) {
        await profilesApi.updateProfile(user.id, {
          name: formData.name,
          mobile: formData.mobile,
          table_number: formData.tableNumber || null,
          total_spent: profile.total_spent + total,
        });
        await refreshProfile();
      }

      clearCart();

      toast({
        title: 'Success',
        description: 'Your order has been placed successfully!',
      });

      navigate('/orders');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Checkout</h1>
        <p className="text-muted-foreground">Complete your order</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Table Number</Label>
                <Input
                  id="tableNumber"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  placeholder="Enter your table number (optional)"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-1">
          <Card className="shadow-warm sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                
                {applicableDiscount && (
                  <div className="flex justify-between items-center text-accent">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span>Discount ({applicableDiscount.discount_percentage}%)</span>
                    </div>
                    <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {applicableDiscount && (
                <Badge variant="secondary" className="w-full justify-center py-2">
                  <Tag className="h-3 w-3 mr-1" />
                  {applicableDiscount.name} Applied
                </Badge>
              )}

              {profile && !applicableDiscount && discounts.length > 0 && (
                <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                  <p className="font-medium mb-1">💡 Loyalty Rewards</p>
                  <p>
                    You've spent ₹{profile.total_spent.toFixed(2)}. 
                    Spend ₹{(discounts[discounts.length - 1].min_spending - profile.total_spent).toFixed(2)} more 
                    to unlock {discounts[discounts.length - 1].discount_percentage}% off!
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
