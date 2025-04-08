import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p className="mb-4">Welcome to Campus Connect, {user?.name}!</p>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Your Information</h2>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Department:</strong> {user?.department}</p>
            {user?.role === 'student' && (
              <p><strong>Year:</strong> {user?.year}</p>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
            <p className="text-gray-600 italic">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
