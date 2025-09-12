import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      title: "General Knowledge",
      description: "Test your knowledge across various topics",
      category: "General",
      difficulty: "Medium",
      questions: 15,
      duration: 10,
      isActive: true,
      featured: false
    },
    {
      id: 2,
      title: "Mathematics",
      description: "Challenge yourself with math problems",
      category: "Math",
      difficulty: "Hard",
      questions: 20,
      duration: 15,
      isActive: true,
      featured: true
    },
    {
      id: 3,
      title: "Science Quiz",
      description: "Explore the wonders of science",
      category: "Science",
      difficulty: "Medium",
      questions: 12,
      duration: 8,
      isActive: false,
      featured: false
    }
  ]);

  const toggleActive = (id) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const toggleFeatured = (id) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id ? { ...item, featured: !item.featured } : item
      )
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground">
            Manage quiz categories and menu items
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItems.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {menuItems.filter(item => item.isActive).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Featured Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {menuItems.filter(item => item.featured).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {menuItems.filter(item => !item.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items List */}
      <div className="space-y-4">
        {menuItems.map((item) => (
          <Card key={item.id} className={!item.isActive ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge className={getDifficultyColor(item.difficulty)}>
                      {item.difficulty}
                    </Badge>
                    {item.featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                    {!item.isActive && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  <CardDescription className="mt-1">
                    {item.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Category</Label>
                  <p className="font-medium">{item.category}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Questions</Label>
                  <p className="font-medium">{item.questions}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Duration</Label>
                  <p className="font-medium">{item.duration} min</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <p className={`font-medium ${item.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={() => toggleActive(item.id)}
                  />
                  <Label className="text-sm">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={item.featured}
                    onCheckedChange={() => toggleFeatured(item.id)}
                  />
                  <Label className="text-sm">Featured</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Item Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Menu Item</CardTitle>
          <CardDescription>
            Create a new quiz category for the menu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Quiz title" />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="literature">Literature</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Quiz description" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="questions">Number of Questions</Label>
              <Input id="questions" type="number" placeholder="15" />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" placeholder="10" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch id="active" />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="featured" />
              <Label htmlFor="featured">Featured</Label>
            </div>
          </div>

          <Button>Create Menu Item</Button>
        </CardContent>
      </Card>
    </div>
  );
}

