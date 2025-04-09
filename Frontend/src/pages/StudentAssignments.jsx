import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/apiUtils';

const StudentAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Submission form state
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    submissionTitle: '',
    submissionText: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Update API calls to remove duplicate /api/v1 prefix
        const [assignmentsRes, submissionsRes] = await Promise.all([
          fetchWithAuth('/assignments'),
          fetchWithAuth('/submissions/my-submissions')
        ]);
        
        if (assignmentsRes.error) {
          throw new Error(assignmentsRes.error);
        }
        
        if (submissionsRes.error) {
          throw new Error(submissionsRes.error);
        }
        
        // Access the correct properties in the response
        setAssignments(assignmentsRes.data?.assignments || []);
        setMySubmissions(submissionsRes.data?.submissions || []);
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
    setSubmissionData({
      ...submissionData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmissionClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionForm(true);
    setSubmissionData({
      submissionTitle: `${user?.name}'s submission for ${assignment.title}`,
      submissionText: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data, error } = await fetchWithAuth('/api/v1/submissions', {
        method: 'POST',
        data: {
          assignmentId: selectedAssignment._id,
          ...submissionData
        }
      });
      
      if (error) {
        throw new Error(error);
      }
      
      // Refresh my submissions
      const submissionsResponse = await fetchWithAuth('/api/v1/submissions/my-submissions');
      
      if (submissionsResponse.error) {
        throw new Error(submissionsResponse.error);
      }
      
      setMySubmissions(submissionsResponse.data?.submissions || []);
      
      setSuccess('Assignment submitted successfully!');
      setShowSubmissionForm(false);
      setSubmissionData({
        submissionTitle: '',
        submissionText: '',
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting assignment:', err);
      setError(err.message || 'Failed to submit assignment');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if assignment is already submitted
  const isSubmitted = (assignmentId) => {
    return mySubmissions.some(submission => submission.assignmentId._id === assignmentId);
  };

  // Helper function to get submission details for an assignment
  const getSubmission = (assignmentId) => {
    return mySubmissions.find(submission => submission.assignmentId._id === assignmentId);
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

  if (loading && assignments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Assignments</h1>
        <p className="text-gray-600">View and submit assignments for your courses</p>
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
      
      {/* Display no assignments message */}
      {!loading && assignments.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 italic">No assignments have been assigned to you yet.</p>
        </div>
      )}
      
      {/* Assignments list */}
      {assignments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map(assignment => (
            <div key={assignment._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{assignment.title}</h3>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                  isSubmitted(assignment._id) 
                    ? 'bg-green-100 text-green-800'
                    : new Date(assignment.dueDate) < new Date()
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isSubmitted(assignment._id) 
                    ? 'Submitted' 
                    : new Date(assignment.dueDate) < new Date()
                      ? 'Overdue'
                      : 'Pending'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>
              
              <div className="space-y-2 text-sm">
                <p><strong>Course:</strong> {assignment.courseName}</p>
                <p><strong>Due Date:</strong> {formatDate(assignment.dueDate)}</p>
                <p><strong>Max Marks:</strong> {assignment.maxMarks}</p>
                
                {isSubmitted(assignment._id) && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <h4 className="font-medium text-gray-700 mb-1">Your Submission:</h4>
                    <p className="text-sm">Title: {getSubmission(assignment._id).submissionTitle}</p>
                    {getSubmission(assignment._id).isGraded && (
                      <p className="text-sm font-medium text-green-600">
                        Grade: {getSubmission(assignment._id).marks} / {assignment.maxMarks}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted on: {formatDate(getSubmission(assignment._id).createdAt)}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                {!isSubmitted(assignment._id) && new Date(assignment.dueDate) >= new Date() && (
                  <button 
                    onClick={() => handleSubmissionClick(assignment)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                  >
                    Submit Assignment
                  </button>
                )}
                
                {isSubmitted(assignment._id) && (
                  <button className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition duration-200">
                    View Submission
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Submission Modal */}
      {showSubmissionForm && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Submit Assignment: {selectedAssignment.title}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="submissionTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Submission Title
                </label>
                <input
                  id="submissionTitle"
                  name="submissionTitle"
                  type="text"
                  required
                  value={submissionData.submissionTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="submissionText" className="block text-sm font-medium text-gray-700 mb-1">
                  Submission Text (Your Answer)
                </label>
                <textarea
                  id="submissionText"
                  name="submissionText"
                  rows={5}
                  required
                  value={submissionData.submissionText}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Type your answer here..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowSubmissionForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
