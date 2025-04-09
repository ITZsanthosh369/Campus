import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import SidebarLayout from './SidebarLayout';
import '../styles/main.css';

const DashboardLayout = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRole is specified, check if user has that role
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <SidebarLayout>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {children}
        </div>
      </SidebarLayout>
    </div>
  );
};

export default DashboardLayout;
