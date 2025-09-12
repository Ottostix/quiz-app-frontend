import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ChefHat, Clock, Edit, Trash2, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';

export default function Recipes() {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [menus, setMenus] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    prep_time: '',
    cook_time: '',
    image_url: ''
  });

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStoreId) {
      fetchMenus(selectedStoreId);
    }
  }, [selectedStoreId]);

  useEffect(() => {
    if (selectedMenuId) {
      fetchRecipes(selectedMenuId);
    }
  }, [selectedMenuId]);

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
        if (data.length > 0) {
          setSelectedMenuId(data[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const fetchRecipes = async (menuId) => {
    try {
      const response = await fetch(`/api/menus/${menuId}/recipes`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const createRecipe = async () => {
    if (!selectedMenuId) return;

    // Convert ingredients string to array
    const ingredientsArray = newRecipe.ingredients
      .split('\n')
      .filter(ingredient => ingredient.trim())
      .map(ingredient => ingredient.trim());

    const recipeData = {
      ...newRecipe,
      ingredients: ingredientsArray,
      prep_time: parseInt(newRecipe.prep_time) || null,
      cook_time: parseInt(newRecipe.cook_time) || null
    };

    try {
      const response = await fetch(`/api/menus/${selectedMenuId}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        const recipe = await response.json();
        setRecipes([...recipes, recipe]);
        setNewRecipe({
          name: '',
          ingredients: '',
          instructions: '',
          prep_time: '',
          cook_time: '',
          image_url: ''
        });
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  const deleteRecipe = async (recipeId) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const generateQuizFromRecipe = async (recipe) => {
    // This will be implemented in the next phase
    alert(`Quiz generation for "${recipe.name}" will be implemented in the next phase!`);
  };

  const canManageRecipes = user?.role && ['master', 'admin', 'manager'].includes(user.role);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recipe Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant recipes and generate training quizzes
          </p>
        </div>
        {canManageRecipes && selectedMenuId && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Recipe</DialogTitle>
                <DialogDescription>
                  Add a new recipe to your menu
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <Label htmlFor="name">Recipe Name</Label>
                  <Input
                    id="name"
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                    placeholder="Classic Burger"
                  />
                </div>
                <div>
                  <Label htmlFor="ingredients">Ingredients (one per line)</Label>
                  <Textarea
                    id="ingredients"
                    value={newRecipe.ingredients}
                    onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                    placeholder="1 lb ground beef&#10;4 burger buns&#10;4 slices cheese"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={newRecipe.instructions}
                    onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
                    placeholder="1. Form ground beef into 4 patties&#10;2. Season with salt and pepper..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prep_time">Prep Time (minutes)</Label>
                    <Input
                      id="prep_time"
                      type="number"
                      value={newRecipe.prep_time}
                      onChange={(e) => setNewRecipe({ ...newRecipe, prep_time: e.target.value })}
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cook_time">Cook Time (minutes)</Label>
                    <Input
                      id="cook_time"
                      type="number"
                      value={newRecipe.cook_time}
                      onChange={(e) => setNewRecipe({ ...newRecipe, cook_time: e.target.value })}
                      placeholder="10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL (optional)</Label>
                  <Input
                    id="image_url"
                    value={newRecipe.image_url}
                    onChange={(e) => setNewRecipe({ ...newRecipe, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button onClick={createRecipe} className="w-full">
                  Create Recipe
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Store and Menu Selection */}
      <div className="flex space-x-4">
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

        {menus.length > 0 && (
          <div className="w-full max-w-xs">
            <Label htmlFor="menu-select">Select Menu</Label>
            <Select value={selectedMenuId} onValueChange={setSelectedMenuId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a menu" />
              </SelectTrigger>
              <SelectContent>
                {menus.map((menu) => (
                  <SelectItem key={menu.id} value={menu.id.toString()}>
                    {menu.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {selectedMenuId && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChefHat className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => generateQuizFromRecipe(recipe)}
                      title="Generate Quiz"
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                    {canManageRecipes && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteRecipe(recipe.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <CardDescription>
                  {recipe.ingredients.slice(0, 3).join(', ')}
                  {recipe.ingredients.length > 3 && '...'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {recipe.instructions}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      {recipe.prep_time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Prep: {recipe.prep_time}m</span>
                        </div>
                      )}
                      {recipe.cook_time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Cook: {recipe.cook_time}m</span>
                        </div>
                      )}
                    </div>
                    <Badge variant="outline">
                      {recipe.total_time}m total
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedMenuId && recipes.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No recipes</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating your first recipe.
          </p>
          {canManageRecipes && (
            <div className="mt-6">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Recipe
              </Button>
            </div>
          )}
        </div>
      )}

      {!selectedMenuId && (
        <div className="text-center py-12">
          <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Select a menu</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a menu to view and manage its recipes.
          </p>
        </div>
      )}
    </div>
  );
}

