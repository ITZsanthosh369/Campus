import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AnnouncementManagement = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audience: 'All'
  });

  // Mock announcements data
  const mockAnnouncements = [
    {
      id: 1,
      title: 'Midterm Examination Schedule',
      description: 'The midterm examinations will be held from October 10-15, 2023. Please check your schedule on the portal.',
      date: '2023-09-25',
      audience: 'All'
    },
    {
      id: 2,
      title: 'Faculty Meeting',
      description: 'All faculty members are requested to attend the meeting on October 5, 2023 at 2:00 PM in the conference room.',
      date: '2023-09-22',
      audience: 'Faculty'
    },
    {
      id: 3,
      title: 'Student Council Elections',
      description: 'Nominations for student council positions are now open. Submit your application by October 5.',
      date: '2023-09-18',
      audience: 'Students'
    },
    {
      id: 4,
      title: 'Department Budget Review',
      description: 'Department budget review meeting will be held on October 8, 2023. All department heads must attend.',
      date: '2023-09-20',
      audience: 'Department Only'
    }
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnnouncements(mockAnnouncements);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements. Please try again later.');
        setLoading(false);
      }
    };

    fetchAnnouncements();
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
    try {
      // Simulate API call delay
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new announcement with current date and generated ID
      const newAnnouncement = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0]
      };
      
      // Add to announcements list
      setAnnouncements(prevAnnouncements => [newAnnouncement, ...prevAnnouncements]);
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        audience: 'All'
      });
      setIsModalOpen(false);
      setLoading(false);
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError('Failed to create announcement. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Simulate API call delay
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove announcement from list
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.filter(announcement => announcement.id !== id)
      );
      
      setLoading(false);
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError('Failed to delete announcement. Please try again.');
      setLoading(false);
    }
  };

  // Display loading spinner
  if (loading && announcements.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Display error message
  if (error && announcements.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getBadgeColor = (audience) => {
    switch (audience) {
      case 'Faculty': return 'bg-green-100 text-green-800';
      case 'Students': return 'bg-blue-100 text-blue-800';
      case 'Department Only': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Announcement Management</h1>
        <p className="text-gray-600">Create and manage announcements for your institution</p>
      </header>

      {/* Create Announcement Button */}
      <div className="mb-6">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
        >
          + Create New Announcement
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{announcement.title}</h3>
              <span className={`${getBadgeColor(announcement.audience)} text-xs font-medium px-2.5 py-0.5 rounded`}>
                {announcement.audience}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              {new Date(announcement.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="mb-4">{announcement.description}</p>
            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(announcement.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Create New Announcement</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Announcement Title"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Announcement details..."
                />
              </div>
              <div className="mb-4">
                <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                <select
                  id="audience"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="All">All</option>
                  <option value="Faculty">Faculty Only</option>
                  <option value="Students">Students Only</option>
                  <option value="Department Only">Department Only</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  {loading ? 'Creating...' : 'Create Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManagement;
