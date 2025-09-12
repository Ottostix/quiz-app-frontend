import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Store, Users, Menu, MapPin, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';

export default function Stores() {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const createStore = async () => {
    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newStore),
      });

      if (response.ok) {
        const store = await response.json();
        setStores([...stores, store]);
        setNewStore({ name: '', location: '', description: '' });
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating store:', error);
    }
  };

  const deleteStore = async (storeId) => {
    if (!confirm('Are you sure you want to delete this store?')) return;

    try {
      const response = await fetch(`/api/stores/${storeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setStores(stores.filter(store => store.id !== storeId));
      }
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading stores...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Store Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant locations and their details
          </p>
        </div>
        {user?.role === 'master' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Store
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Store</DialogTitle>
                <DialogDescription>
                  Add a new restaurant location to your system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    value={newStore.name}
                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                    placeholder="Downtown Restaurant"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newStore.location}
                    onChange={(e) => setNewStore({ ...newStore, location: e.target.value })}
                    placeholder="123 Main St, Downtown"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newStore.description}
                    onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
                    placeholder="A modern restaurant serving contemporary cuisine"
                  />
                </div>
                <Button onClick={createStore} className="w-full">
                  Create Store
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Store className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                </div>
                {user?.role === 'master' && (
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteStore(store.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{store.location}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {store.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{store.user_count} users</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Menu className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{store.menu_count} menus</span>
                  </div>
                </div>
                <Badge variant="secondary">
                  {new Date(store.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-12">
          <Store className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No stores</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating your first store location.
          </p>
          {user?.role === 'master' && (
            <div className="mt-6">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Store
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

