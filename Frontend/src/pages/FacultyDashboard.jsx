import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dummy recent activity data
  const recentActivities = [
    {
      id: 1,
      title: 'Posted Assignment',
      description: 'Data Structures - Assignment 3 posted',
      date: '2023-09-28'
    },
    {
      id: 2,
      title: 'Attendance Marked',
      description: 'Marked attendance for Database Systems class',
      date: '2023-09-27'
    },
    {
      id: 3,
      title: 'Graded Submissions',
      description: 'Graded 25 student submissions for Web Development',
      date: '2023-09-26'
    }
  ];

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, Professor {user?.name}!</h1>
        <p className="text-gray">Your faculty dashboard at Campus Connect</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Faculty Information Card */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-xl font-semibold mb-4">Faculty Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Department:</strong> {user?.department}</p>
              <p><strong>Role:</strong> {user?.role}</p>
            </div>
          </div>
        </div>

        {/* Recent Activities Card */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="pb-3 border-b border-gray-200 last:border-0">
                  <h3 className="font-medium">{activity.title}</h3>
                  <p className="my-1 text-sm">{activity.description}</p>
                  <p className="text-xs text-gray">{new Date(activity.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Management Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Management Tools</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => navigate('/faculty/classes')} 
            className="btn btn-primary"
          >
            📚 My Classes
          </button>
          <button className="btn">Post Announcement</button>
          <button className="btn">View Student Queries</button>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
