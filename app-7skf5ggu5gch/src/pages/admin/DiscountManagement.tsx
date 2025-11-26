import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { discountsApi } from '@/db/api';
import type { Discount } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';

export default function DiscountManagement() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_spending: '',
    discount_percentage: '',
    active: true,
  });

  useEffect(() => {
    if (profile?.role !== 'admin') {
      navigate('/');
      return;
    }
    loadDiscounts();
  }, [profile, navigate]);

  const loadDiscounts = async () => {
    try {
      const data = await discountsApi.getAllDiscounts();
      setDiscounts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load discounts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (discount?: Discount) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        name: discount.name,
        description: discount.description || '',
        min_spending: discount.min_spending.toString(),
        discount_percentage: discount.discount_percentage.toString(),
        active: discount.active,
      });
    } else {
      setEditingDiscount(null);
      setFormData({
        name: '',
        description: '',
        min_spending: '',
        discount_percentage: '',
        active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.min_spending || !formData.discount_percentage) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const minSpending = parseFloat(formData.min_spending);
    const discountPercentage = parseFloat(formData.discount_percentage);

    if (isNaN(minSpending) || minSpending < 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid minimum spending amount',
        variant: 'destructive',
      });
      return;
    }

    if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
      toast({
        title: 'Error',
        description: 'Discount percentage must be between 0 and 100',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingDiscount) {
        await discountsApi.updateDiscount(editingDiscount.id, {
          name: formData.name,
          description: formData.description || null,
          min_spending: minSpending,
          discount_percentage: discountPercentage,
          active: formData.active,
        });
        toast({
          title: 'Success',
          description: 'Discount updated successfully',
        });
      } else {
        await discountsApi.createDiscount({
          name: formData.name,
          description: formData.description || null,
          min_spending: minSpending,
          discount_percentage: discountPercentage,
          active: formData.active,
        });
        toast({
          title: 'Success',
          description: 'Discount created successfully',
        });
      }
      setDialogOpen(false);
      loadDiscounts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save discount',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount?')) return;

    try {
      await discountsApi.deleteDiscount(id);
      toast({
        title: 'Success',
        description: 'Discount deleted successfully',
      });
      loadDiscounts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete discount',
        variant: 'destructive',
      });
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">Discount Management</h1>
          <p className="text-muted-foreground">Manage loyalty rewards and promotional offers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Discount
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDiscount ? 'Edit Discount' : 'Add Discount'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Gold Tier"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Discount description"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_spending">Min Spending ($) *</Label>
                  <Input
                    id="min_spending"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.min_spending}
                    onChange={(e) => setFormData({ ...formData, min_spending: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_percentage">Discount (%) *</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingDiscount ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {discounts.map(discount => (
          <Card key={discount.id} className="shadow-warm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{discount.name}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(discount)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(discount.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {discount.description || 'No description'}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Min Spending</span>
                  <span className="font-medium">₹{discount.min_spending.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Discount</span>
                  <span className="text-xl font-bold text-primary">
                    {discount.discount_percentage}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${discount.active ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                  {discount.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
