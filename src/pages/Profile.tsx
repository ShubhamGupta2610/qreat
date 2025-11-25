import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { profilesApi, discountsApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Hash, DollarSign, Award } from 'lucide-react';
import type { Discount } from '@/types/types';

export default function Profile() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    table_number: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        mobile: profile.mobile,
        table_number: profile.table_number || '',
      });
    }
    loadDiscounts();
  }, [profile]);

  const loadDiscounts = async () => {
    try {
      const data = await discountsApi.getActiveDiscounts();
      setDiscounts(data);
    } catch (error) {
      console.error('Failed to load discounts:', error);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      await profilesApi.updateProfile(profile.id, {
        name: formData.name,
        mobile: formData.mobile,
        table_number: formData.table_number || null,
      });

      await refreshProfile();
      setEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const currentDiscount = discounts.find(d => profile && profile.total_spent >= d.min_spending);
  const nextDiscount = discounts.find(d => profile && profile.total_spent < d.min_spending);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">My Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="shadow-warm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Personal Information</CardTitle>
                {!editing ? (
                  <Button onClick={() => setEditing(true)}>Edit</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: profile.name,
                        mobile: profile.mobile,
                        table_number: profile.table_number || '',
                      });
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    value={profile.username}
                    disabled
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    disabled={!editing}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="table_number">Table Number</Label>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="table_number"
                    value={formData.table_number}
                    onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
                    disabled={!editing}
                    placeholder="Not set"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Spending Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Spent</p>
                <p className="text-4xl font-bold text-primary">
                  ${profile.total_spent.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Loyalty Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentDiscount && (
                <div className="p-4 bg-accent/10 rounded-lg border border-accent">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Current Tier</span>
                    <Badge variant="secondary">{currentDiscount.name}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-accent">
                    {currentDiscount.discount_percentage}% OFF
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {currentDiscount.description}
                  </p>
                </div>
              )}

              {nextDiscount && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Next Reward</p>
                  <p className="text-lg font-bold mb-1">{nextDiscount.name}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {nextDiscount.discount_percentage}% off on all orders
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        ${profile.total_spent.toFixed(2)} / ${nextDiscount.min_spending.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((profile.total_spent / nextDiscount.min_spending) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ${(nextDiscount.min_spending - profile.total_spent).toFixed(2)} more to unlock
                    </p>
                  </div>
                </div>
              )}

              {!currentDiscount && !nextDiscount && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No active rewards available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
