import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { profilesApi } from '@/db/api';
import type { Profile } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, DollarSign } from 'lucide-react';

export default function CustomerManagement() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      navigate('/');
      return;
    }
    loadCustomers();
  }, [profile, navigate]);

  const loadCustomers = async () => {
    try {
      const data = await profilesApi.getAllProfiles();
      setCustomers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load customers',
        variant: 'destructive',
      });
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
        <h1 className="text-4xl font-bold mb-2 gradient-text">Customer Management</h1>
        <p className="text-muted-foreground">View customer information and spending history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {customers.map(customer => (
          <Card key={customer.id} className="shadow-warm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{customer.name}</CardTitle>
                <Badge variant={customer.role === 'admin' ? 'default' : 'secondary'}>
                  {customer.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Username:</span>
                <span className="font-medium">{customer.username}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Mobile:</span>
                <span className="font-medium">{customer.mobile}</span>
              </div>
              {customer.table_number && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Table:</span>
                  <span className="font-medium">{customer.table_number}</span>
                </div>
              )}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    ₹{customer.total_spent.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Joined {new Date(customer.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
