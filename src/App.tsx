import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import PropertyDetails from "./pages/PropertyDetails";
import ScheduleMeeting from "./pages/ScheduleMeeting";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Dashboards
import BuyerDashboard from "./pages/dashboards/BuyerDashboard";
import InvestorDashboard from "./pages/dashboards/InvestorDashboard";
import DeveloperDashboard from "./pages/dashboards/DeveloperDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/schedule" element={<ScheduleMeeting />} />
            <Route path="/auth" element={<Auth />} />

            {/* Buyer Dashboard Routes */}
            <Route
              path="/buyer/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['buyer', 'admin']}>
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Investor Dashboard Routes */}
            <Route
              path="/investor/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['investor', 'admin']}>
                  <InvestorDashboard />
                </ProtectedRoute>
              }
            />

            {/* Developer Dashboard Routes */}
            <Route
              path="/developer/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['developer', 'admin']}>
                  <DeveloperDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard Routes */}
            <Route
              path="/admin/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
