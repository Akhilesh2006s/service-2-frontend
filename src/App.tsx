import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import FakeDataHome from "./pages/FakeDataHome";
import LinkedInHome from "./pages/LinkedInHome";
import NewHome from "./pages/NewHome";
import Login from "./pages/Login";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import OrganizationProfile from "./pages/OrganizationProfile";
import OpportunityDetail from "./pages/OpportunityDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Role-based Route Component
const RoleRoute = ({ role, children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'organization') {
      return <Navigate to="/organization-dashboard" replace />;
    } else if (user?.role === 'employee') {
      return <Navigate to="/employee-dashboard" replace />;
    }
  }
  
  return children;
};

// Index Route Component (shows Airbnb-style grid for non-authenticated users)
const IndexRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    // Redirect authenticated users to LinkedIn-style home
    return <Navigate to="/home" replace />;
  }
  
  // Show Airbnb-style grid for non-authenticated users
  return <NewHome />;
};

// Home Route Component (shows LinkedIn-style feed for authenticated users)
const HomeRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect non-authenticated users to index page
    return <Navigate to="/" replace />;
  }
  
  // Show LinkedIn-style feed for authenticated users
  return <LinkedInHome />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexRoute />} />
            <Route path="/home" element={<HomeRoute />} />
            <Route path="/landing" element={<Index />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/organization-dashboard" 
              element={
                <RoleRoute role="organization">
                  <OrganizationDashboard />
                </RoleRoute>
              } 
            />
            <Route 
              path="/employee-dashboard" 
              element={
                <RoleRoute role="employee">
                  <EmployeeDashboard />
                </RoleRoute>
              } 
            />
            <Route 
              path="/organization/:organizationId" 
              element={<OrganizationProfile />} 
            />
            <Route 
              path="/opportunity/:id" 
              element={<OpportunityDetail />}
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
