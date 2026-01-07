/**
 * Unified Dashboard Page
 * Redirects to role-specific dashboard or shows Buyer/Investor enhanced dashboard
 */

import { Navigate } from 'react-router-dom';
import { useAuth, getDashboardRoute } from '@/hooks/useAuth';

const Dashboard = () => {
  const { role, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to the appropriate role-based dashboard
  const dashboardRoute = getDashboardRoute(role);
  return <Navigate to={dashboardRoute} replace />;
};

export default Dashboard;
