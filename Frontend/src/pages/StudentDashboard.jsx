import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/apiUtils';
import styles from '../styles/StudentDashboard.module.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

        // Check for errors in any response
        if (announcementsRes.error || assignmentsRes.error || classesRes.error) {
          const errorMsg = announcementsRes.error || assignmentsRes.error || classesRes.error;
          throw new Error(errorMsg);
        }

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
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </div>
    );
  }

  // Count total enrolled courses and classes
  const totalClasses = dashboardData.myClasses.classGroups.length + dashboardData.myClasses.courseGroups.length;

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1>Welcome, {user?.name}!</h1>
        <p>Your student dashboard at Campus Connect</p>
      </header>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Enrolled In</h3>
          <p>{totalClasses} Classes</p>
        </div>
        
        <div className={styles.statCard}>
          <h3>Year</h3>
          <p>{user?.year || 'N/A'}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3>Department</h3>
          <p>{user?.department || 'N/A'}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3>Batch</h3>
          <p>{user?.batch || 'N/A'}</p>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Student Information Card */}
        <div className={styles.infoCard}>
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.cardIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Student Information
          </h2>
          <div className={styles.infoFields}>
            <p className={styles.infoField}><strong>Name:</strong> {user?.name}</p>
            <p className={styles.infoField}><strong>Email:</strong> {user?.email}</p>
            <p className={styles.infoField}><strong>Department:</strong> {user?.department}</p>
            <p className={styles.infoField}><strong>Class Group:</strong> {user?.classGroup}</p>
            <p className={styles.infoField}><strong>Batch:</strong> {user?.batch}</p>
            <p className={styles.infoField}><strong>Year:</strong> {user?.year}</p>
          </div>
        </div>

        {/* Recent Announcements Card */}
        <div className={styles.infoCard}>
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.cardIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Recent Announcements
          </h2>
          <div className={styles.announcementsList}>
            {dashboardData.recentAnnouncements.length > 0 ? (
              dashboardData.recentAnnouncements.map(announcement => (
                <div key={announcement._id || announcement.id} className={styles.activityItem}>
                  <h3>{announcement.title}</h3>
                  <p>{announcement.content || announcement.description}</p>
                  <p className={styles.activityDate}>{formatDate(announcement.createdAt || announcement.date)}</p>
                </div>
              ))
            ) : (
              <p className={styles.activityEmpty}>No recent announcements.</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className={styles.infoCard}>
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.cardIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Upcoming Assignments
        </h2>
        <div className={styles.assignmentList}>
          {dashboardData.upcomingAssignments.length > 0 ? (
            dashboardData.upcomingAssignments.map(assignment => (
              <div key={assignment._id} className={styles.activityItem}>
                <div className={styles.assignmentInfo}>
                  <h3>{assignment.title}</h3>
                  <p>{assignment.courseName}</p>
                </div>
                <div className={styles.assignmentMeta}>
                  <p>Due: {formatDate(assignment.dueDate)}</p>
                  <p>Max Marks: {assignment.maxMarks}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.activityEmpty}>No upcoming assignments.</p>
          )}
        </div>
      </div>

      {/* Quick Navigation Section */}
      <div className={styles.actionsSection}>
        <h2>Quick Navigation</h2>
        <div className={styles.actionsGrid}>
          <button 
            className={styles.actionButton}
            onClick={() => navigate('/student/classes')}
          >
            <span className={styles.actionIcon}>📚</span> My Classes
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => navigate('/student/assignments')}
          >
            <span className={styles.actionIcon}>📝</span> Assignments
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => navigate('/student/announcements')}
          >
            <span className={styles.actionIcon}>📢</span> Announcements
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => navigate('/student/queries')}
          >
            <span className={styles.actionIcon}>❓</span> Submit Query
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
