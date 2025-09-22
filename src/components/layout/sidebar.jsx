import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FileQuestion, 
  BarChart3, 
  Menu as MenuIcon, 
  Settings, 
  Users, 
  BookOpen,
  Store,
  ChefHat,
  Sparkles,
  FileText
} from "lucide-react";

export default function Sidebar() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  const isAdmin = user && ["admin", "manager", "master"].includes(user.role);
  const isMaster = user && user.role === "master";

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/quiz", label: "Take Quiz", icon: FileQuestion },
    { path: "/results", label: "Results", icon: BarChart3 },
    { path: "/menu", label: "Menu", icon: MenuIcon },
  ];

  const managementItems = [
    { path: "/menus", label: "Menus", icon: MenuIcon },
    { path: "/recipes", label: "Recipes", icon: ChefHat },
    { path: "/quiz-generator", label: "AI Quiz Generator", icon: Sparkles },
    { path: "/documents/upload", label: "Upload Document", icon: FileText, adminOnly: true },
    { path: "/documents/list", label: "View Documents", icon: FileText },
  ];

  const adminItems = [
    { path: "/admin/questions", label: "Questions", icon: BookOpen },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/menu", label: "Menu Management", icon: Settings },
  ];

  const masterItems = [
    { path: "/stores", label: "Stores", icon: Store },
  ];

  const isActive = (path) => location === path;

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        ))}
        
        <div className="pt-4 pb-2">
          <h3 className="text-sm font-medium text-muted-foreground px-2">
            Management
          </h3>
        </div>
        {managementItems.map((item) => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        ))}
        
        {isMaster && (
          <>
            <div className="pt-4 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground px-2">
                Master
              </h3>
            </div>
            {masterItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </>
        )}
        
        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground px-2">
                Administration
              </h3>
            </div>
            {adminItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}

