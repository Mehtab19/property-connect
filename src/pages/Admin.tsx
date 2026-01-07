/**
 * Admin Page
 * Entry point for admin functionality - redirects to admin dashboard
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Admin = () => {
  const navigate = useNavigate();
  const { role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    }
  }, [role, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default Admin;
