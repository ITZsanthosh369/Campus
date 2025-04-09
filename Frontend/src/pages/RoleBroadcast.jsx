import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const RoleBroadcast = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    audience: 'all-students'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [broadcastHistory, setBroadcastHistory] = useState([]);

  // Mock broadcast history data
  const mockBroadcastHistory = [
    {
      id: 1,
      subject: 'Upcoming Faculty Meeting',
      message: 'Reminder that we have a faculty meeting scheduled for Friday at 2:00 PM in the conference room.',
      audience: 'all-faculty',
      date: '2023-10-01',
      sender: user?.name || 'Department Head'
    },
    {
      id: 2,
      subject: 'Exam Schedule Update',
      message: 'Please note that the final exam schedule has been updated. Check the academic portal for details.',
      audience: 'all-students',
      date: '2023-09-28',
      sender: user?.name || 'Department Head'
    },
    {
      id: 3,
      subject: 'System Maintenance Notice',
      message: 'The campus portal will be unavailable this Saturday from 10 PM to 2 AM for scheduled maintenance.',
      audience: 'all-users',
      date: '2023-09-25',
      sender: user?.name || 'Department Head'
    },
  ];

  useEffect(() => {
    // Mock API call to fetch broadcast history
    const fetchBroadcastHistory = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBroadcastHistory(mockBroadcastHistory);
      } catch (err) {
        console.error('Error fetching broadcast history:', err);
        setError('Failed to load broadcast history.');
      }
    };

    fetchBroadcastHistory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new broadcast message with current date and generated ID
      const newBroadcast = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
        sender: user?.name || 'Department Head'
      };
      
      // Add to broadcast history
      setBroadcastHistory(prevHistory => [newBroadcast, ...prevHistory]);
      
      // Show success message and reset form
      setSuccess(true);
      setFormData({
        subject: '',
        message: '',
        audience: 'all-students'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error sending broadcast:', err);
      setError('Failed to send broadcast message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format audience labels
  const getAudienceLabel = (audienceValue) => {
    switch (audienceValue) {
      case 'all-students': return 'All Students';
      case 'all-faculty': return 'All Faculty';
      case 'department-users': return 'All Users in My Department';
      case 'all-users': return 'All Users';
      default: return audienceValue;
    }
  };

  // Helper function to get badge color based on audience
  const getBadgeColor = (audience) => {
    switch (audience) {
      case 'all-students': return 'bg-blue-100 text-blue-800';
      case 'all-faculty': return 'bg-green-100 text-green-800';
      case 'department-users': return 'bg-purple-100 text-purple-800';
      case 'all-users': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Role-Based Broadcasting</h1>
        <p className="text-gray-600">Send targeted messages to specific roles in your organization</p>
      </div>

      {/* Form section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Compose New Message</h2>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>Broadcast message sent successfully!</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <select
              id="audience"
              name="audience"
              value={formData.audience}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all-students">All Students</option>
              <option value="all-faculty">All Faculty</option>
              <option value="department-users">All Users in My Department</option>
              <option value="all-users">All Users</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject (Optional)
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter subject"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Type your message here..."
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400"
            >
              {loading ? 'Sending...' : 'Send Broadcast'}
            </button>
          </div>
        </form>
      </div>

      {/* Broadcasts section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Broadcast History</h2>
        
        {broadcastHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No broadcast messages have been sent yet.</p>
        ) : (
          <div className="space-y-6">
            {broadcastHistory.map((broadcast) => (
              <div key={broadcast.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">
                    {broadcast.subject || 'No Subject'}
                  </h3>
                  <span className={`${getBadgeColor(broadcast.audience)} text-xs font-medium px-2.5 py-0.5 rounded`}>
                    {getAudienceLabel(broadcast.audience)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(broadcast.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} by {broadcast.sender}
                </p>
                <p className="text-gray-700">{broadcast.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleBroadcast;
