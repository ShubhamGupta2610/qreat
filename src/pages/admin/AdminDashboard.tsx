import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ordersApi, profilesApi, menuApi } from '@/db/api';
import { Users, ShoppingBag, UtensilsCrossed, DollarSign, Tag, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalMenuItems: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (profile?.role !== 'admin') {
      navigate('/');
      return;
    }
    loadStats();
  }, [profile, navigate]);

  const loadStats = async () => {
    try {
      const [orders, customers, menuItems] = await Promise.all([
        ordersApi.getAllOrders(),
        profilesApi.getAllProfiles(),
        menuApi.getAllMenuItems(),
      ]);

      const revenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total_amount, 0);

      setStats({
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalMenuItems: menuItems.length,
        totalRevenue: revenue,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-500',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-green-500',
    },
    {
      title: 'Menu Items',
      value: stats.totalMenuItems,
      icon: UtensilsCrossed,
      color: 'text-accent',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-primary',
    },
  ];

  const quickLinks = [
    { title: 'Menu Management', path: '/admin/menu', icon: UtensilsCrossed, description: 'Add, edit, or remove menu items' },
    { title: 'Order Management', path: '/admin/orders', icon: ShoppingBag, description: 'View and manage customer orders' },
    { title: 'Customer Management', path: '/admin/customers', icon: Users, description: 'View customer information and spending' },
    { title: 'Discount Management', path: '/admin/discounts', icon: Tag, description: 'Manage loyalty rewards and offers' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your restaurant operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-warm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Card key={index} className="shadow-warm hover:shadow-glow transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{link.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                      </div>
                    </div>
                    <Link to={link.path}>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
