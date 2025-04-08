import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component that redirects unauthenticated users to the login page
 * Uses Outlet from React Router to render the child routes when authenticated
 */
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
