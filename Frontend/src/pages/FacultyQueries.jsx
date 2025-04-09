import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentQueries, respondToQuery, getMyClasses } from '../services/facultyService';

const FacultyQueries = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [queries, setQueries] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [responseData, setResponseData] = useState({
    queryId: '',
    response: '',
    status: 'answered'
  });
  const [showResponseForm, setShowResponseForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch queries and classes in parallel
        const [queriesRes, classesRes] = await Promise.all([
          getStudentQueries(),
          getMyClasses()
        ]);
        
        if (queriesRes.error) {
          throw new Error(queriesRes.error);
        }
        
        if (classesRes.error) {
          throw new Error(classesRes.error);
        }
        
        setQueries(queriesRes.data?.queries || []);
        
        // Extract course data for filter dropdown
        const coursesList = [];
        if (classesRes.data?.courseGroups?.length > 0) {
          classesRes.data.courseGroups.forEach(course => {
            coursesList.push({
              id: course._id,
              name: `${course.courseCode} - ${course.courseName}`,
            });
          });
        }
        
        setCourses(coursesList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching queries:', err);
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleCourseFilter = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    
    try {
      setLoading(true);
      
      const { data, error } = await getStudentQueries(courseId || null);
      
      if (error) {
        throw new Error(error);
      }
      
      setQueries(data?.queries || []);
    } catch (err) {
      console.error('Error filtering queries:', err);
      setError(err.message || 'Failed to filter queries');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResponse = (query) => {
    setResponseData({
      queryId: query._id,
      response: query.response || '',
      status: query.status || 'pending'
    });
    setShowResponseForm(true);
  };

  const handleResponseChange = (e) => {
    setResponseData({
      ...responseData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data, error } = await respondToQuery(responseData.queryId, {
        response: responseData.response,
        status: responseData.status
      });
      
      if (error) {
        throw new Error(error);
      }
      
      // Refresh queries list
      const queriesRes = await getStudentQueries(selectedCourse || null);
      
      if (queriesRes.error) {
        throw new Error(queriesRes.error);
      }
      
      setQueries(queriesRes.data?.queries || []);
      setSuccess('Response submitted successfully!');
      setShowResponseForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting response:', err);
      setError(err.message || 'Failed to submit response');
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

  if (loading && queries.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Student Queries</h1>
        <p className="text-gray-600">View and respond to student queries</p>
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
      
      {/* Course filter */}
      <div className="mb-6">
        <label htmlFor="courseFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Course
        </label>
        <select
          id="courseFilter"
          value={selectedCourse}
          onChange={handleCourseFilter}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Display no queries message */}
      {!loading && queries.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 italic">No pending queries to display.</p>
        </div>
      )}
      
      {/* Response form */}
      {showResponseForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Respond to Query</h2>
          
          <form onSubmit={handleSubmitResponse} className="space-y-4">
            <div>
              <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-1">
                Your Response
              </label>
              <textarea
                id="response"
                name="response"
                rows={4}
                required
                value={responseData.response}
                onChange={handleResponseChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Type your response here..."
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={responseData.status}
                onChange={handleResponseChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="answered">Answered</option>
                <option value="closed">Closed</option>
                <option value="pending">Keep Pending</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setShowResponseForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {loading ? 'Submitting...' : 'Submit Response'}
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
              
              <div className="flex justify-between items-center text-sm">
                <div>
                  <p><strong>From:</strong> {query.studentName}</p>
                  <p><strong>Course:</strong> {query.courseName}</p>
                  <p><strong>Received:</strong> {formatDate(query.createdAt || query.submittedAt)}</p>
                </div>
                
                <button
                  onClick={() => handleOpenResponse(query)}
                  disabled={loading}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  {query.response ? 'Edit Response' : 'Respond'}
                </button>
              </div>
              
              {query.response && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <h4 className="font-medium text-gray-700 mb-1">Your Response:</h4>
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

export default FacultyQueries;
