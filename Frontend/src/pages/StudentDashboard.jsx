import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/apiUtils';
import APIResponseDebugger from '../components/APIResponseDebugger';
import APIDebugger from '../components/APIDebugger';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResponses, setApiResponses] = useState({
    announcements: null,
    assignments: null,
    classes: null
  });
  const [dashboardData, setDashboardData] = useState({
    recentAnnouncements: [],
    upcomingAssignments: [],
    myClasses: { classGroups: [], courseGroups: [] }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch data in parallel with the utility function
        // Remove /api/v1 prefix as it's already in the baseURL
        const [announcementsRes, assignmentsRes, classesRes] = await Promise.all([
          fetchWithAuth('/announcements'),
          fetchWithAuth('/assignments'),
          fetchWithAuth('/users/my-classes'),
        ]);

        // Log API responses for debugging 
        console.log('Announcements API response:', announcementsRes);
        console.log('Assignments API response:', assignmentsRes);
        console.log('Classes API response:', classesRes);

        // Store raw responses for the debugger component
        setApiResponses({
          announcements: announcementsRes.data,
          assignments: assignmentsRes.data,
          classes: classesRes.data
        });

        // Check for errors in any response
        if (announcementsRes.error || assignmentsRes.error || classesRes.error) {
          const errorMsg = announcementsRes.error || assignmentsRes.error || classesRes.error;
          throw new Error(errorMsg);
        }

        // Verify correct data structure before processing
        // Announcements should be in: announcementsRes.data.announcements
        // Assignments should be in: assignmentsRes.data.assignments
        // Classes should be in: classesRes.data.classGroups and classesRes.data.courseGroups
        console.log('Announcements array exists:', !!announcementsRes.data?.announcements);
        console.log('Assignments array exists:', !!assignmentsRes.data?.assignments);
        console.log('ClassGroups array exists:', !!classesRes.data?.classGroups);
        console.log('CourseGroups array exists:', !!classesRes.data?.courseGroups);

        // Process and set data with proper null checks
        setDashboardData({
          recentAnnouncements: (announcementsRes.data?.announcements || []).slice(0, 3),
          upcomingAssignments: (assignmentsRes.data?.assignments || [])
            .filter(assignment => new Date(assignment.dueDate) >= new Date())
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 3),
          myClasses: {
            classGroups: classesRes.data?.classGroups || [],
            courseGroups: classesRes.data?.courseGroups || []
          }
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Helper function to format date
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Count total enrolled courses and classes
  const totalClasses = dashboardData.myClasses.classGroups.length + dashboardData.myClasses.courseGroups.length;

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Your student dashboard at Campus Connect</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-gray-500 text-sm">Enrolled In</h3>
          <p className="text-2xl font-bold text-indigo-600">{totalClasses} Classes</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-gray-500 text-sm">Year</h3>
          <p className="text-2xl font-bold text-indigo-600">{user?.year || 'N/A'}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-gray-500 text-sm">Department</h3>
          <p className="text-2xl font-bold text-indigo-600">{user?.department || 'N/A'}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-gray-500 text-sm">Batch</h3>
          <p className="text-2xl font-bold text-indigo-600">{user?.batch || 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Information Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
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

        {/* Recent Announcements Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Announcements</h2>
          <div className="space-y-4">
            {dashboardData.recentAnnouncements.length > 0 ? (
              dashboardData.recentAnnouncements.map(announcement => (
                <div key={announcement._id || announcement.id} className="pb-3 border-b border-gray-200 last:border-0">
                  <h3 className="font-medium">{announcement.title}</h3>
                  <p className="my-1 text-sm">{announcement.content || announcement.description}</p>
                  <p className="text-xs text-gray-500">{formatDate(announcement.createdAt || announcement.date)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 italic">No recent announcements.</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Upcoming Assignments</h2>
        <div className="space-y-4">
          {dashboardData.upcomingAssignments.length > 0 ? (
            dashboardData.upcomingAssignments.map(assignment => (
              <div key={assignment._id} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0">
                <div>
                  <h3 className="font-medium">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">{assignment.courseName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Due: {formatDate(assignment.dueDate)}</p>
                  <p className="text-xs text-gray-500">Max Marks: {assignment.maxMarks}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 italic">No upcoming assignments.</p>
          )}
        </div>
      </div>

      {/* Quick Navigation Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
            onClick={() => navigate('/student/classes')}
          >
            📚 My Classes
          </button>
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
            onClick={() => navigate('/student/assignments')}
          >
            📝 Assignments
          </button>
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
            onClick={() => navigate('/student/announcements')}
          >
            📢 Announcements
          </button>
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
            onClick={() => navigate('/student/queries')}
          >
            ❓ Submit Query
          </button>
        </div>
      </div>

      {/* API Response Debugger (Only visible in development environment) */}
      <APIResponseDebugger data={apiResponses} title="Dashboard API Responses" />
      
      {/* API Debugger to check connectivity */}
      <APIDebugger />
    </div>
  );
};

export default StudentDashboard;
