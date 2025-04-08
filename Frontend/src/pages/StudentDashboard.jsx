import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const StudentDashboard = () => {
  const { user } = useAuth();

  // Dummy announcement data
  const recentAnnouncements = [
    {
      id: 1,
      title: 'Midterm Examination Schedule',
      content: 'The midterm examinations will be held from October 10-15, 2023. Please check your schedule on the portal.',
      date: '2023-09-25'
    },
    {
      id: 2,
      title: 'Campus Maintenance Notice',
      content: 'The main library will be closed for renovations this weekend. Alternative study spaces will be available.',
      date: '2023-09-22'
    },
    {
      id: 3,
      title: 'Student Council Elections',
      content: 'Nominations for student council positions are now open. Submit your application by October 5.',
      date: '2023-09-18'
    }
  ];

  return (
    <DashboardLayout allowedRole="student">
      <div className="p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray">Your student dashboard at Campus Connect</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Information Card */}
          <div className="card">
            <div className="card-body">
              <h2 className="text-xl font-semibold mb-4">Student Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Department:</strong> {user?.department}</p>
                <p><strong>Class Group:</strong> {user?.classGroup}</p>
                <p><strong>Batch:</strong> {user?.batch}</p>
                <p><strong>Year:</strong> {user?.year}</p>
              </div>
            </div>
          </div>

          {/* Recent Announcements Card */}
          <div className="card">
            <div className="card-body">
              <h2 className="text-xl font-semibold mb-4">Recent Announcements</h2>
              <div className="space-y-4">
                {recentAnnouncements.map(announcement => (
                  <div key={announcement.id} className="pb-3 border-b border-gray-200 last:border-0">
                    <h3 className="font-medium">{announcement.title}</h3>
                    <p className="my-1 text-sm">{announcement.content}</p>
                    <p className="text-xs text-gray">{new Date(announcement.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary">My Classes</button>
            <button className="btn">Assignment Calendar</button>
            <button className="btn">Course Materials</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
