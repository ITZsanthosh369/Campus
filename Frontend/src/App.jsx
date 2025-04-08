import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentClasses from './pages/StudentClasses';

// Components
import DashboardLayout from './components/DashboardLayout';

const App = () => {
  const { user } = useAuth();

  // Helper function to determine home path based on user role
  const getHomePath = () => {
    if (!user) return '/login';
    return user.role === 'faculty' ? '/faculty-dashboard' : '/student-dashboard';
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to={getHomePath()} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={getHomePath()} />} />

      {/* Role-specific dashboard routes with DashboardLayout */}
      <Route 
        path="/student-dashboard" 
        element={
          <DashboardLayout allowedRole="student">
            <StudentDashboard />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/faculty-dashboard" 
        element={
          <DashboardLayout allowedRole="faculty">
            <FacultyDashboard />
          </DashboardLayout>
        } 
      />
      
      {/* Student specific routes */}
      <Route 
        path="/student/classes" 
        element={
          <DashboardLayout allowedRole="student">
            <StudentClasses />
          </DashboardLayout>
        } 
      />
      
      {/* Legacy dashboard redirect */}
      <Route path="/dashboard" element={<Navigate to={getHomePath()} />} />
      
      {/* Default and 404 routes */}
      <Route path="/" element={<Navigate to={getHomePath()} />} />
      <Route path="*" element={<Navigate to={getHomePath()} />} />
    </Routes>
  );
};

export default App;
