import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const CircularUpload = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [circulars, setCirculars] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audience: 'All'
  });

  // Mock circulars data
  const mockCirculars = [
    {
      id: 1,
      title: 'End Semester Examination Schedule',
      description: 'Timetable for all courses in the upcoming end semester examinations.',
      date: '2023-10-15',
      audience: 'All',
      fileName: 'exam_schedule_2023.pdf',
      fileSize: '1.2 MB',
      fileType: 'application/pdf'
    },
    {
      id: 2,
      title: 'Faculty Meeting Minutes',
      description: 'Minutes from the last faculty meeting held on October 10, 2023.',
      date: '2023-10-12',
      audience: 'Faculty',
      fileName: 'faculty_meeting_minutes.pdf',
      fileSize: '0.8 MB',
      fileType: 'application/pdf'
    },
    {
      id: 3,
      title: 'Department Budget Allocation',
      description: 'Budget allocation for the current academic year by department.',
      date: '2023-10-08',
      audience: 'Department Only',
      fileName: 'budget_allocation_2023.pdf',
      fileSize: '1.5 MB',
      fileType: 'application/pdf'
    }
  ];

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        // Simulate API call delay
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data
        setCirculars(mockCirculars);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching circulars:', err);
        setError('Failed to load circulars. Please try again later.');
        setLoading(false);
      }
    };

    fetchCirculars();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is PDF
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        setFile(null);
        e.target.value = null; // Reset file input
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        setFile(null);
        e.target.value = null; // Reset file input
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      // Simulate API call delay
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new circular with current date and generated ID
      const newCircular = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileType: file.type
      };
      
      // Add to circulars list
      setCirculars(prevCirculars => [newCircular, ...prevCirculars]);
      
      // Reset form and file
      setFormData({
        title: '',
        description: '',
        audience: 'All'
      });
      setFile(null);
      
      // Reset file input
      document.getElementById('file-upload').value = '';
      
      setLoading(false);
    } catch (err) {
      console.error('Error uploading circular:', err);
      setError('Failed to upload circular. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Simulate API call delay
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove circular from list
      setCirculars(prevCirculars => 
        prevCirculars.filter(circular => circular.id !== id)
      );
      
      setLoading(false);
    } catch (err) {
      console.error('Error deleting circular:', err);
      setError('Failed to delete circular. Please try again.');
      setLoading(false);
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to get badge color based on audience
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
        <h1 className="text-2xl font-bold mb-2">Circular Management</h1>
        <p className="text-gray-600">Upload and manage important circulars and documents</p>
      </header>

      {/* Upload Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload New Circular</h2>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Circular Title"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Brief description of the circular"
            />
          </div>
          
          <div>
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
          
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Upload PDF Document</label>
            <input
              type="file"
              id="file-upload"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">Only PDF files. Max size: 5MB</p>
          </div>
          
          {/* File Preview */}
          {file && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium">File Preview:</h3>
              <div className="flex items-start mt-2">
                <svg className="w-8 h-8 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)} • {file.type}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400"
            >
              {loading ? 'Uploading...' : 'Upload Circular'}
            </button>
          </div>
        </form>
      </div>

      {/* Circulars List Section */}
      <h2 className="text-xl font-semibold mb-4">Uploaded Circulars</h2>
      
      {/* Loading State */}
      {loading && circulars.length === 0 && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && circulars.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No circulars uploaded yet.</p>
        </div>
      )}
      
      {/* Circulars Grid */}
      {circulars.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {circulars.map((circular) => (
            <div key={circular.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{circular.title}</h3>
                <span className={`${getBadgeColor(circular.audience)} text-xs font-medium px-2.5 py-0.5 rounded`}>
                  {circular.audience}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {new Date(circular.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="mb-4">{circular.description}</p>
              
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
              
              <div className="flex justify-between">
                <button
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition duration-200"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(circular.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CircularUpload;
