import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import Menu from "@/pages/menu";
import Stores from "@/pages/stores";
import Menus from "@/pages/menus";
import Recipes from "@/pages/recipes";
import QuizGenerator from "@/pages/quiz-generator";
import QuestionsAdmin from "@/pages/admin/questions";
import UsersAdmin from "@/pages/admin/users";
import MenuManagement from "@/pages/admin/menu-management";
import { AuthProvider } from "./lib/auth.jsx";
import { useAuth } from "./hooks/use-auth";
import Navbar from "./components/layout/navbar";
import Sidebar from "./components/layout/sidebar";
import Footer from "./components/layout/footer";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { OfflineIndicator, OfflineBanner } from "@/components/ui/offline-indicator";
import { Suspense, lazy } from "react";
import DocumentUpload from "./components/DocumentUpload";
import DocumentList from "./components/DocumentList";

// Layout component for authenticated pages
function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <OfflineBanner />
        <Navbar />
        <main className="flex-1 p-4 md:p-6 bg-background">
          <Suspense fallback={<LoadingScreen fullScreen={false} message="Loading content..." />}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}

// Protected route component
function ProtectedRoute({ 
  children, 
  admin = false 
}) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }
  
  if (!user) {
    return <LoadingScreen message="Redirecting to login..." />;
  }
  
  if (admin && !["manager", "master"].includes(user.role)) {
    return <NotFound />;
  }
  
  return <AppLayout>{children(user)}</AppLayout>;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="/">
        {() => (
          <ProtectedRoute>
            {(user) => <Dashboard />}
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/quiz">
        {() => (
          <ProtectedRoute>
            {(user) => <Quiz />}
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/results">
        {() => (
          <ProtectedRoute>
            {(user) => <Results />}
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/menu">
        {() => (
          <ProtectedRoute>
            {(user) => <Menu />}
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/admin/questions">
        {() => (
          <ProtectedRoute admin={true}>
            {(user) => <QuestionsAdmin />}
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/admin/users">
        {() => (
          <ProtectedRoute admin={true}>
            {(user) => <UsersAdmin />}
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/admin/menu">
        {() => (
          <ProtectedRoute admin={true}>
            {(user) => <MenuManagement />}
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/stores">
        {() => (
          <ProtectedRoute admin={true}>
            {(user) => <Stores />}
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/menus">
        {() => (
          <ProtectedRoute>
            {(user) => <Menus />}
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/recipes">
        {() => (
          <ProtectedRoute>
            {(user) => <Recipes />}
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/quiz-generator">
        {() => (
          <ProtectedRoute>
            {(user) => <QuizGenerator />}
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/documents/upload">
        {() => (
          <ProtectedRoute admin={true}>
            {(user) => <DocumentUpload />}
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/documents/list">
        {() => (
          <ProtectedRoute>
            {(user) => <DocumentList />}
          </ProtectedRoute>
        )}
      </Route>
      
      <Route>
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <OfflineIndicator />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;