import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/apiUtils';

const StudentQueries = () => {
  const { user } = useAuth();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [courses, setCourses] = useState([]);
  
  // Query form state
  const [showQueryForm, setShowQueryForm] = useState(false);
  const [queryData, setQueryData] = useState({
    courseId: '',
    courseName: '',
    facultyId: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Update API calls to remove duplicate /api/v1 prefix
        const [queriesRes, coursesRes] = await Promise.all([
          fetchWithAuth('/queries/my-queries'),
          fetchWithAuth('/users/my-classes'),
        ]);
        
        if (queriesRes.error) {
          throw new Error(queriesRes.error);
        }
        
        if (coursesRes.error) {
          throw new Error(coursesRes.error);
        }
        
        // Set queries with proper null checks
        setQueries(queriesRes.data?.queries || []);
        
        // Extract course data for dropdown
        const coursesList = [];
        if (coursesRes.data?.courseGroups?.length > 0) {
          coursesRes.data.courseGroups.forEach(course => {
            coursesList.push({
              id: course._id,
              name: `${course.courseCode} - ${course.courseName}`,
              facultyId: course.faculty?._id || ''
            });
          });
        }
        
        setCourses(coursesList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (e) => {
    setQueryData({
      ...queryData,
      [e.target.name]: e.target.value
    });
    
    // If course selection changes, update courseName and facultyId
    if (e.target.name === 'courseId') {
      const selectedCourse = courses.find(course => course.id === e.target.value);
      if (selectedCourse) {
        setQueryData(prev => ({
          ...prev,
          courseId: e.target.value,
          courseName: selectedCourse.name,
          facultyId: selectedCourse.facultyId
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Update API call to remove duplicate /api/v1 prefix
      const { data, error } = await fetchWithAuth('/queries', {
        method: 'POST',
        data: queryData
      });
      
      if (error) {
        throw new Error(error);
      }
      
      // Refresh queries list - remove duplicate /api/v1 prefix
      const queriesResponse = await fetchWithAuth('/queries/my-queries');
      
      if (queriesResponse.error) {
        throw new Error(queriesResponse.error);
      }
      
      setQueries(queriesResponse.data?.queries || []);
      
      setSuccess('Query submitted successfully!');
      setShowQueryForm(false);
      setQueryData({
        courseId: '',
        courseName: '',
        facultyId: '',
        subject: '',
        message: '',
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting query:', err);
      setError(err.message || 'Failed to submit query');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'answered':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && queries.length === 0 && !showQueryForm) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Queries</h1>
        <p className="text-gray-600">Submit and track queries to your course instructors</p>
      </header>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>{success}</p>
        </div>
      )}
      
      {/* New Query button */}
      <div className="mb-6">
        <button 
          onClick={() => setShowQueryForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
        >
          + New Query
        </button>
      </div>
      
      {/* Display no queries message */}
      {!loading && queries.length === 0 && !showQueryForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 italic">You haven't submitted any queries yet.</p>
        </div>
      )}
      
      {/* Query form */}
      {showQueryForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Submit New Query</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                id="courseId"
                name="courseId"
                required
                value={queryData.courseId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={queryData.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Brief subject of your query"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={queryData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Describe your query in detail..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setShowQueryForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {loading ? 'Submitting...' : 'Submit Query'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Queries list */}
      {queries.length > 0 && (
        <div className="space-y-6">
          {queries.map(query => (
            <div key={query._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{query.subject}</h3>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusBadgeColor(query.status)}`}>
                  {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{query.message}</p>
              
              <div className="space-y-2 text-sm">
                <p><strong>Course:</strong> {query.courseName}</p>
                <p><strong>Submitted:</strong> {formatDate(query.createdAt)}</p>
              </div>
              
              {query.response && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <h4 className="font-medium text-gray-700 mb-1">Response:</h4>
                  <p className="text-sm">{query.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentQueries;
