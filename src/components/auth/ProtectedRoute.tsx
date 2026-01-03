/**
 * Protected Route Component
 * Guards routes based on authentication and role requirements
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, AppRole, getDashboardRoute } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
  requireAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has permission
  if (allowedRoles && allowedRoles.length > 0 && role) {
    // Admin has access to everything
    if (role === 'admin') {
      return <>{children}</>;
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(role)) {
      // Redirect to their own dashboard if they don't have permission
      return <Navigate to={getDashboardRoute(role)} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
