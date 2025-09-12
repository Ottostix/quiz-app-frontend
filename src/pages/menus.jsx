import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Menu, ChefHat, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import { useLocation } from 'wouter';

export default function Menus() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [stores, setStores] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStoreId) {
      fetchMenus(selectedStoreId);
    }
  }, [selectedStoreId]);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setStores(data);
        // Auto-select user's store if they're not master/admin
        if (user?.store_id && user.role !== 'master' && user.role !== 'admin') {
          setSelectedStoreId(user.store_id.toString());
        } else if (data.length > 0) {
          setSelectedStoreId(data[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async (storeId) => {
    try {
      const response = await fetch(`/api/stores/${storeId}/menus`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setMenus(data);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const createMenu = async () => {
    if (!selectedStoreId) return;

    try {
      const response = await fetch(`/api/stores/${selectedStoreId}/menus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newMenu),
      });

      if (response.ok) {
        const menu = await response.json();
        setMenus([...menus, menu]);
        setNewMenu({ name: '', description: '', is_active: true });
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating menu:', error);
    }
  };

  const deleteMenu = async (menuId) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;

    try {
      const response = await fetch(`/api/menus/${menuId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setMenus(menus.filter(menu => menu.id !== menuId));
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  const viewRecipes = (menuId) => {
    setLocation(`/recipes?menu=${menuId}`);
  };

  const canManageMenus = user?.role && ['master', 'admin', 'manager'].includes(user.role);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading menus...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant menus and their items
          </p>
        </div>
        {canManageMenus && selectedStoreId && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Menu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Menu</DialogTitle>
                <DialogDescription>
                  Add a new menu to your restaurant
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Menu Name</Label>
                  <Input
                    id="name"
                    value={newMenu.name}
                    onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                    placeholder="Main Menu"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newMenu.description}
                    onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
                    placeholder="Our signature dishes and daily specials"
                  />
                </div>
                <Button onClick={createMenu} className="w-full">
                  Create Menu
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Store Selection */}
      {(user?.role === 'master' || user?.role === 'admin') && stores.length > 0 && (
        <div className="w-full max-w-xs">
          <Label htmlFor="store-select">Select Store</Label>
          <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedStoreId && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => (
            <Card key={menu.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Menu className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{menu.name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => viewRecipes(menu.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canManageMenus && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteMenu(menu.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <CardDescription>
                  {menu.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <ChefHat className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{menu.recipe_count} recipes</span>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={menu.is_active ? "default" : "secondary"}>
                      {menu.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">
                      {new Date(menu.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedStoreId && menus.length === 0 && (
        <div className="text-center py-12">
          <Menu className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No menus</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating your first menu.
          </p>
          {canManageMenus && (
            <div className="mt-6">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Menu
              </Button>
            </div>
          )}
        </div>
      )}

      {!selectedStoreId && (
        <div className="text-center py-12">
          <Menu className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Select a store</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a store to view and manage its menus.
          </p>
        </div>
      )}
    </div>
  );
}

