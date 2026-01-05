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
import CompareProperties from "./pages/CompareProperties";
import MortgageHub from "./pages/MortgageHub";
import Onboarding from "./pages/Onboarding";
import Properties from "./pages/Properties";
import Chat from "./pages/Chat";

// Dashboards
import BuyerDashboard from "./pages/dashboards/BuyerDashboard";
import InvestorDashboard from "./pages/dashboards/InvestorDashboard";
import DeveloperDashboard from "./pages/dashboards/DeveloperDashboard";
import BrokerDashboard from "./pages/dashboards/BrokerDashboard";
import MortgagePartnerDashboard from "./pages/dashboards/MortgagePartnerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

// Admin Pages
import UserManagement from "./pages/admin/UserManagement";
import PropertyApprovals from "./pages/admin/PropertyApprovals";
import PlatformAnalytics from "./pages/admin/PlatformAnalytics";
import MeetingRequests from "./pages/admin/MeetingRequests";
import AdminSettings from "./pages/admin/AdminSettings";
import LeadManagement from "./pages/admin/LeadManagement";

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
            <Route path="/compare" element={<CompareProperties />} />
            <Route path="/mortgage" element={<MortgageHub />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/chat" element={<Chat />} />

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

            {/* Broker Dashboard Routes */}
            <Route
              path="/broker/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['broker', 'admin']}>
                  <BrokerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Mortgage Partner Dashboard Routes */}
            <Route
              path="/mortgage-partner/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['mortgage_partner', 'admin']}>
                  <MortgagePartnerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/approvals"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PropertyApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PlatformAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/meetings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MeetingRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/leads"
              element={
                <ProtectedRoute allowedRoles={['admin', 'broker']}>
                  <LeadManagement />
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
