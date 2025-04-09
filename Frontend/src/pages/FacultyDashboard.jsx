import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFacultyActivities } from '../services/facultyService';
import '../styles/FacultyDashboard.css'; // Ensure FacultyDashboard.css is imported

// Dashboard Card component for consistent UI
const DashboardCard = ({ icon, title, subtitle, onClick, bgColor = "bg-indigo-100", iconColor = "text-indigo-600" }) => (
  <button 
    onClick={onClick} 
    className="flex flex-col items-center justify-center p-4 md:p-6 bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-100 hover:border-indigo-200 transition-all transform hover:-translate-y-1 w-full h-full"
  >
    <div className={`rounded-full ${bgColor} p-3 mb-3`}>
      <div className={`w-6 h-6 md:w-5 md:h-5 lg:w-4 lg:h-4 ${iconColor}`}>
        {icon}
      </div>
    </div>
    <span className="font-medium text-gray-800 dark:text-gray-100 text-center">{title}</span>
    {subtitle && <span className="text-xs text-gray-500 mt-1 text-center">{subtitle}</span>}
  </button>
);

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 transition duration-300 hover:shadow-md hover:border-indigo-100 dark:bg-gray-900 dark:border-gray-700">
    <div className="flex items-center space-x-4">
      <div className={`p-2 rounded-full ${color.bg} ${color.text}`}>
        <div className="w-5 h-5 md:w-4 md:h-4">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-xl font-bold ${color.text}`}>{value}</p>
      </div>
    </div>
  </div>
);

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    pendingQueries: 0,
    upcomingAssignments: 0,
    courseCount: 0,
    studentCount: 0
  });

  // Fetch faculty activities and stats on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch faculty activities from the API
        const { data, error } = await getFacultyActivities();
        
        if (error) {
          throw new Error(error);
        }
        
        // Set activities from API response
        setActivities(data?.activities || []);
        
        // Calculate stats from activities - in a real app this would come from the backend
        setStats({
          pendingQueries: 5, // Example value - would be calculated from API data
          upcomingAssignments: 2,
          courseCount: 3,
          studentCount: 78
        });
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700 font-medium">{error}</p>
              <p className="text-sm text-red-600 mt-1">Please try refreshing the page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 shadow-lg">
          <div className="absolute inset-0 opacity-20 bg-pattern-grid"></div>
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Welcome, Professor {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-indigo-100 text-sm md:text-base">
              Your faculty dashboard at Campus Connect
            </p>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 dark:text-white">Dashboard Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            }
            label="Pending Queries"
            value={stats.pendingQueries}
            color={{
              bg: "bg-indigo-50",
              text: "text-indigo-600"
            }}
          />
          <StatCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            label="Assignments"
            value={stats.upcomingAssignments}
            color={{
              bg: "bg-green-50",
              text: "text-green-600"
            }}
          />
          <StatCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            label="Courses"
            value={stats.courseCount}
            color={{
              bg: "bg-blue-50",
              text: "text-blue-600"
            }}
          />
          <StatCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            label="Students"
            value={stats.studentCount}
            color={{
              bg: "bg-amber-50",
              text: "text-amber-600"
            }}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Faculty Information Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 lg:col-span-1 dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-4 md:w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Faculty Information
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex border-b border-gray-100 pb-2 dark:border-gray-700">
              <span className="w-1/3 text-gray-500 dark:text-gray-400">Name:</span>
              <span className="w-2/3 font-medium dark:text-gray-200">{user?.name || 'N/A'}</span>
            </div>
            <div className="flex border-b border-gray-100 pb-2 dark:border-gray-700">
              <span className="w-1/3 text-gray-500 dark:text-gray-400">Email:</span>
              <span className="w-2/3 font-medium dark:text-gray-200">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex border-b border-gray-100 pb-2 dark:border-gray-700">
              <span className="w-1/3 text-gray-500 dark:text-gray-400">Department:</span>
              <span className="w-2/3 font-medium dark:text-gray-200">{user?.department || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="w-1/3 text-gray-500 dark:text-gray-400">Role:</span>
              <span className="w-2/3 font-medium capitalize dark:text-gray-200">{user?.role || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Recent Activities Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 lg:col-span-2 dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-4 md:w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activities
          </h2>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="p-3 border-l-4 border-indigo-400 bg-indigo-50 rounded-r-md hover:bg-indigo-100 transition-colors dark:bg-indigo-900/30 dark:hover:bg-indigo-900/40">
                  <h3 className="font-medium text-indigo-800 dark:text-indigo-300">{activity.title || activity.type}</h3>
                  <p className="my-1 text-sm text-gray-600 dark:text-gray-400">
                    {activity.description || `${activity.type} for ${activity.courseName}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-2.5 md:w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(activity.date)}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-10 md:w-10 lg:h-8 lg:w-8 text-gray-300 dark:text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 italic">No recent activities to display.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">New activities will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 dark:text-white">Management Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            title="My Classes"
            subtitle="View assigned courses and classes"
            onClick={() => navigate('/faculty/classes')}
            bgColor="bg-indigo-100"
            iconColor="text-indigo-600"
          />
          
          <DashboardCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            }
            title="Announcements"
            subtitle="Post announcements to students"
            onClick={() => navigate('/faculty/create-announcement')}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          
          <DashboardCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Student Queries"
            subtitle="Respond to student questions"
            onClick={() => navigate('/faculty/queries')}
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          
          <DashboardCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            title="Assignments"
            subtitle="Create and grade assignments"
            onClick={() => navigate('/faculty/assignments')}
            bgColor="bg-amber-100"
            iconColor="text-amber-600"
          />
          
          <DashboardCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            title="Attendance"
            subtitle="Mark and view attendance records"
            onClick={() => navigate('/faculty/attendance')}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          
          <DashboardCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            }
            title="Circulars"
            subtitle="View and send circulars"
            onClick={() => navigate('/faculty/circulars')}
            bgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>
      </section>

      {/* Upcoming Events Card */}
      <section className="mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-4 md:w-4 lg:h-3.5 lg:w-3.5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upcoming Events
          </h2>
          <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-10 md:w-10 lg:h-8 lg:w-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 italic">No upcoming events.</p>
            <button 
              onClick={() => navigate('/faculty/calendar')}
              className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 text-sm font-medium transition-colors dark:bg-indigo-900/30 dark:hover:bg-indigo-900/40 dark:text-indigo-300"
            >
              View Calendar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FacultyDashboard;
