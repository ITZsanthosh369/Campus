import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentClasses from './pages/StudentClasses';
import FacultyClasses from './pages/FacultyClasses';
import HODDashboard from './pages/HODDashboard';
import DepartmentManagement from './pages/DepartmentManagement';
import PrincipalDashboard from './pages/PrincipalDashboard';
import RoleManagement from './pages/RoleManagement';
import AnnouncementManagement from './pages/AnnouncementManagement';
import CircularUpload from './pages/CircularUpload';
import RoleBroadcast from './pages/RoleBroadcast';
import AnnouncementFeed from './pages/AnnouncementFeed';
import CircularsFeed from './pages/CircularsFeed';
import StudentAssignments from './pages/StudentAssignments';
import StudentQueries from './pages/StudentQueries';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import FacultyQueries from './pages/FacultyQueries';
import FacultyAssignments from './pages/FacultyAssignments';
import FacultyAttendance from './pages/FacultyAttendance';
import FacultyCalendar from './pages/FacultyCalendar';

// Components
import DashboardLayout from './components/DashboardLayout';

const App = () => {
  const { user } = useAuth();

  // Helper function to determine home path based on user role
  const getHomePath = () => {
    if (!user) return '/login';
    if (user.role === 'faculty') return '/faculty-dashboard';
    if (user.role === 'hod') return '/hod-dashboard';
    if (user.role === 'principal') return '/principal-dashboard';
    return '/student-dashboard';
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
      
      {/* HOD specific routes */}
      <Route 
        path="/hod-dashboard" 
        element={
          <DashboardLayout allowedRole="hod">
            <HODDashboard />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/hod/department" 
        element={
          <DashboardLayout allowedRole="hod">
            <DepartmentManagement />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/hod/announcements" 
        element={
          <DashboardLayout allowedRole="hod">
            <AnnouncementManagement />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/hod/circulars" 
        element={
          <DashboardLayout allowedRole="hod">
            <CircularUpload />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/hod/broadcast" 
        element={
          <DashboardLayout allowedRole="hod">
            <RoleBroadcast />
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
      
      <Route 
        path="/student/announcements" 
        element={
          <DashboardLayout allowedRole="student">
            <AnnouncementFeed />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/student/circulars" 
        element={
          <DashboardLayout allowedRole="student">
            <CircularsFeed />
          </DashboardLayout>
        } 
      />

      <Route 
        path="/student/assignments" 
        element={
          <DashboardLayout allowedRole="student">
            <StudentAssignments />
          </DashboardLayout>
        } 
      />

      <Route 
        path="/student/queries" 
        element={
          <DashboardLayout allowedRole="student">
            <StudentQueries />
          </DashboardLayout>
        } 
      />

      {/* Faculty specific routes */}
      <Route 
        path="/faculty/classes" 
        element={
          <DashboardLayout allowedRole="faculty">
            <FacultyClasses />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/faculty/announcements" 
        element={
          <DashboardLayout allowedRole="faculty">
            <AnnouncementFeed />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/faculty/circulars" 
        element={
          <DashboardLayout allowedRole="faculty">
            <CircularsFeed />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/faculty/queries" 
        element={
          <DashboardLayout allowedRole="faculty">
            <FacultyQueries />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/faculty/assignments" 
        element={
          <DashboardLayout allowedRole="faculty">
            <FacultyAssignments />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/faculty/attendance" 
        element={
          <DashboardLayout allowedRole="faculty">
            <FacultyAttendance />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/faculty/create-announcement" 
        element={
          <DashboardLayout allowedRole="faculty">
            <AnnouncementManagement />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/faculty/calendar" 
        element={
          <DashboardLayout allowedRole="faculty">
            <FacultyCalendar />
          </DashboardLayout>
        } 
      />
      
      {/* Principal specific routes */}
      <Route 
        path="/principal-dashboard" 
        element={
          <DashboardLayout allowedRole="principal">
            <PrincipalDashboard />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/principal/role-management" 
        element={
          <DashboardLayout allowedRole="principal">
            <RoleManagement />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/principal/announcements" 
        element={
          <DashboardLayout allowedRole="principal">
            <AnnouncementManagement />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/principal/circulars" 
        element={
          <DashboardLayout allowedRole="principal">
            <CircularUpload />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/principal/broadcast" 
        element={
          <DashboardLayout allowedRole="principal">
            <RoleBroadcast />
          </DashboardLayout>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        } 
      />

      <Route 
        path="/admin-dashboard" 
        element={
          <DashboardLayout allowedRole="admin">
            <AdminDashboard />
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
