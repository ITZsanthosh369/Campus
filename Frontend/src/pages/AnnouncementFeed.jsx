import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AnnouncementFeed = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock announcements data
  const mockAnnouncements = [
    {
      id: 1,
      title: 'Midterm Examination Schedule',
      description: 'The midterm examinations will be held from October 10-15, 2023. Please check your schedule on the portal.',
      audience: 'All',
      department: 'All',
      timestamp: '2023-09-25T10:30:00.000Z',
      author: 'Academic Office'
    },
    {
      id: 2,
      title: 'Faculty Meeting',
      description: 'All faculty members are requested to attend the meeting on October 5, 2023 at 2:00 PM in the conference room.',
      audience: 'Faculty',
      department: 'All',
      timestamp: '2023-09-22T14:15:00.000Z',
      author: 'Dean of Faculty'
    },
    {
      id: 3,
      title: 'Student Council Elections',
      description: 'Nominations for student council positions are now open. Submit your application by October 5.',
      audience: 'Students',
      department: 'All',
      timestamp: '2023-09-20T09:00:00.000Z',
      author: 'Student Affairs'
    },
    {
      id: 4,
      title: 'Computer Science Department Meeting',
      description: 'Monthly department meeting will be held on October 7, 2023. All department members must attend.',
      audience: 'Department Only',
      department: 'Computer Science',
      timestamp: '2023-09-19T11:45:00.000Z',
      author: 'CS Department Head'
    },
    {
      id: 5,
      title: 'Electrical Engineering Workshop',
      description: 'Special workshop on Advanced Circuit Design scheduled for next week.',
      audience: 'Department Only',
      department: 'Electrical Engineering',
      timestamp: '2023-09-18T13:20:00.000Z',
      author: 'EE Department Head'
    },
    {
      id: 6,
      title: 'Campus Maintenance Notice',
      description: 'The main library will be closed for renovations this weekend. Alternative study spaces will be available.',
      audience: 'All',
      department: 'All',
      timestamp: '2023-09-15T16:30:00.000Z',
      author: 'Facilities Management'
    }
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter announcements based on user role and department
        const filteredAnnouncements = mockAnnouncements.filter(announcement => {
          // Always show announcements for everyone
          if (announcement.audience === 'All') return true;
          
          // Role-based filtering
          if (announcement.audience === 'Faculty' && user.role !== 'faculty') return false;
          if (announcement.audience === 'Students' && user.role !== 'student') return false;
          
          // Department-based filtering
          if (announcement.audience === 'Department Only') {
            return announcement.department === 'All' || announcement.department === user.department;
          }
          
          return true;
        });
        
        // Sort in reverse chronological order
        const sortedAnnouncements = filteredAnnouncements.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setAnnouncements(sortedAnnouncements);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements. Please try again later.');
        setLoading(false);
      }
    };

    if (user) {
      fetchAnnouncements();
    }
  }, [user]);

  // Helper function to get badge color based on audience
  const getBadgeColor = (audience) => {
    switch (audience) {
      case 'Faculty': return 'bg-green-100 text-green-800';
      case 'Students': return 'bg-blue-100 text-blue-800';
      case 'Department Only': return 'bg-purple-100 text-purple-800';
      case 'All': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format timestamp to a readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate relative time (e.g., "2 days ago")
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const announcementDate = new Date(timestamp);
    const diffTime = Math.abs(now - announcementDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Announcements</h1>
        <p className="text-gray-600">Stay updated with the latest announcements from your campus</p>
      </header>

      {announcements.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No announcements available at this time.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{announcement.title}</h3>
                <span className={`${getBadgeColor(announcement.audience)} text-xs font-medium px-2.5 py-0.5 rounded`}>
                  {announcement.audience}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="mr-2">{announcement.author}</span>
                <span>•</span>
                <span className="mx-2" title={formatTimestamp(announcement.timestamp)}>
                  {getRelativeTime(announcement.timestamp)}
                </span>
                {announcement.department !== 'All' && (
                  <>
                    <span>•</span>
                    <span className="ml-2">{announcement.department}</span>
                  </>
                )}
              </div>
              
              <p className="text-gray-700">{announcement.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementFeed;
