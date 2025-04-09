import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const CircularsFeed = () => {
  const { user } = useAuth();
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock circulars data
  const mockCirculars = [
    {
      id: 1,
      title: 'End Semester Examination Schedule',
      description: 'Timetable for all courses in the upcoming end semester examinations.',
      audience: 'All',
      department: 'All',
      fileName: 'exam_schedule_2023.pdf',
      fileSize: '1.2 MB',
      fileType: 'application/pdf',
      uploadDate: '2023-10-15T10:30:00.000Z',
      uploader: 'Academic Office'
    },
    {
      id: 2,
      title: 'Faculty Meeting Minutes',
      description: 'Minutes from the last faculty meeting held on October 10, 2023.',
      audience: 'Faculty',
      department: 'All',
      fileName: 'faculty_meeting_minutes.pdf',
      fileSize: '0.8 MB',
      fileType: 'application/pdf',
      uploadDate: '2023-10-12T14:15:00.000Z',
      uploader: 'Dean of Faculty'
    },
    {
      id: 3,
      title: 'Student Council Guidelines',
      description: 'Updated guidelines for student council elections and responsibilities.',
      audience: 'Students',
      department: 'All',
      fileName: 'student_council_guidelines.pdf',
      fileSize: '1.0 MB',
      fileType: 'application/pdf',
      uploadDate: '2023-10-08T09:00:00.000Z',
      uploader: 'Student Affairs'
    },
    {
      id: 4,
      title: 'Computer Science Department Report',
      description: 'Annual report of the Computer Science Department activities and achievements.',
      audience: 'Department Only',
      department: 'Computer Science',
      fileName: 'cs_dept_annual_report.pdf',
      fileSize: '2.3 MB',
      fileType: 'application/pdf',
      uploadDate: '2023-10-05T11:45:00.000Z',
      uploader: 'CS Department Head'
    },
    {
      id: 5,
      title: 'Electrical Engineering Lab Guidelines',
      description: 'Safety guidelines and procedures for the EE laboratories.',
      audience: 'Department Only',
      department: 'Electrical Engineering',
      fileName: 'ee_lab_safety.pdf',
      fileSize: '1.7 MB',
      fileType: 'application/pdf',
      uploadDate: '2023-10-02T13:20:00.000Z',
      uploader: 'EE Department Head'
    },
    {
      id: 6,
      title: 'Campus Infrastructure Updates',
      description: 'Information about ongoing and upcoming infrastructure improvements on campus.',
      audience: 'All',
      department: 'All',
      fileName: 'campus_infrastructure.pdf',
      fileSize: '3.5 MB',
      fileType: 'application/pdf',
      uploadDate: '2023-09-28T16:30:00.000Z',
      uploader: 'Facilities Management'
    }
  ];

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Random error simulation (approximately 10% chance)
        if (Math.random() < 0.1) {
          throw new Error("Simulated fetch error");
        }
        
        // Filter circulars based on user role and department
        const filteredCirculars = mockCirculars.filter(circular => {
          // Always show circulars for everyone
          if (circular.audience === 'All') return true;
          
          // Role-based filtering
          if (circular.audience === 'Faculty' && user.role !== 'faculty') return false;
          if (circular.audience === 'Students' && user.role !== 'student') return false;
          
          // Department-based filtering
          if (circular.audience === 'Department Only') {
            return circular.department === 'All' || circular.department === user.department;
          }
          
          return true;
        });
        
        // Sort in reverse chronological order
        const sortedCirculars = filteredCirculars.sort((a, b) => 
          new Date(b.uploadDate) - new Date(a.uploadDate)
        );
        
        setCirculars(sortedCirculars);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching circulars:', err);
        setError('Failed to load circulars. Please try again later.');
        setLoading(false);
      }
    };

    if (user) {
      fetchCirculars();
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
    const uploadDate = new Date(timestamp);
    const diffTime = Math.abs(now - uploadDate);
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

  // Handle download function (simulate)
  const handleDownload = (fileName) => {
    // In a real app, this would generate a download link to the file
    alert(`Downloading ${fileName}. In a production environment, this would trigger the actual download.`);
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
        <h1 className="text-2xl font-bold mb-2">Circulars</h1>
        <p className="text-gray-600">Access important documents and notifications from your institution</p>
      </header>

      {circulars.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No circulars available at this time.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {circulars.map((circular) => (
            <div key={circular.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{circular.title}</h3>
                <span className={`${getBadgeColor(circular.audience)} text-xs font-medium px-2.5 py-0.5 rounded`}>
                  {circular.audience}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="mr-2">{circular.uploader}</span>
                <span>•</span>
                <span className="mx-2" title={formatTimestamp(circular.uploadDate)}>
                  {getRelativeTime(circular.uploadDate)}
                </span>
                {circular.department !== 'All' && (
                  <>
                    <span>•</span>
                    <span className="ml-2">{circular.department}</span>
                  </>
                )}
              </div>
              
              <p className="mb-4 text-gray-700">{circular.description}</p>
              
              {/* File Display */}
              <div className="p-3 bg-gray-50 rounded-md mb-4">
                <div className="flex items-start">
                  <svg className="w-8 h-8 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">{circular.fileName}</p>
                    <p className="text-xs text-gray-500">{circular.fileSize} • {circular.fileType}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => handleDownload(circular.fileName)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CircularsFeed;
