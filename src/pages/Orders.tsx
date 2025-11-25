import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { ordersApi } from '@/db/api';
import type { Order } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, ChefHat, Truck, Package } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-muted' },
  received: { label: 'Received', icon: CheckCircle, color: 'bg-blue-500' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'bg-accent' },
  delivered: { label: 'Delivered', icon: Truck, color: 'bg-green-500' },
  completed: { label: 'Completed', icon: Package, color: 'bg-primary' },
  cancelled: { label: 'Cancelled', icon: Clock, color: 'bg-destructive' },
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      const data = await ordersApi.getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">My Orders</h1>
        <p className="text-muted-foreground">Track your order history and status</p>
      </div>

      {orders.length === 0 ? (
        <Card className="max-w-md mx-auto text-center shadow-warm">
          <CardContent className="pt-12 pb-8">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground">
              Start ordering from our delicious menu
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;

            return (
              <Card key={order.id} className="shadow-warm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-medium">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal.toFixed(2)}</span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-sm text-accent">
                          <span>Discount</span>
                          <span>-₹{order.discount_amount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span className="text-primary">₹{order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.table_number && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Table: </span>
                        <span className="font-medium">{order.table_number}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
