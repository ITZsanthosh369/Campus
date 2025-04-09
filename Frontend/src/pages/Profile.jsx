import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Get the first letter of the user's name for avatar
  const getInitial = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : '?';
  };

  // Get user role color
  const getRoleColor = () => {
    switch (user?.role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'faculty': return 'bg-green-100 text-green-800';
      case 'hod': return 'bg-purple-100 text-purple-800';
      case 'principal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Classes section content
  const renderClasses = () => {
    return (
      <div className="profile-section">
        <h3 className="text-lg font-medium text-gray-900 mb-4">My Classes</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            You can view detailed information about your classes in the dedicated Classes section.
          </p>
          <button 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => window.location.href = user?.role === 'student' ? '/student/classes' : '/faculty/classes'}
          >
            View Classes
          </button>
        </div>
      </div>
    );
  };

  // Security section content
  const renderSecurity = () => {
    return (
      <div className="profile-section">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Password</h4>
            <p className="text-sm text-gray-500">
              Your password was last updated on {new Date().toLocaleDateString()}
            </p>
            <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-500">
              Change password
            </button>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500">
              Enhance your account security by enabling two-factor authentication
            </p>
            <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-500">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Activity section content
  const renderActivity = () => {
    return (
      <div className="profile-section">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="divide-y divide-gray-200">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="py-3">
              <p className="text-sm font-medium text-gray-900">
                {['Logged in', 'Updated profile', 'Viewed dashboard'][i]}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar" aria-label={`${user?.name}'s profile picture`}>
            {getInitial()}
          </div>
          <div className="profile-title">
            <h2 className="profile-name">{user?.name}</h2>
            <div className={`profile-role ${getRoleColor()}`}>
              {user?.role}
            </div>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="profile-edit-button"
              aria-label="Edit profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Information
          </button>
          <button 
            className={`profile-tab ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            Classes
          </button>
          <button 
            className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button 
            className={`profile-tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-tab-content">
          {/* Information Tab */}
          {activeTab === 'info' && (
            <div className="profile-info">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </div>
                  {user?.role === 'student' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="year">Year</label>
                        <input
                          type="text"
                          id="year"
                          name="year"
                          value={formData.year || user?.year || ''}
                          onChange={handleInputChange}
                          placeholder="e.g., 1, 2, 3, 4"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="batch">Batch</label>
                        <input
                          type="text"
                          id="batch"
                          name="batch"
                          value={formData.batch || user?.batch || ''}
                          onChange={handleInputChange}
                          placeholder="e.g., A, B, C"
                        />
                      </div>
                    </>
                  )}
                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="cancel-button"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="save-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="info-field">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{user?.name}</span>
                  </div>
                  <div className="info-field">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user?.email}</span>
                  </div>
                  <div className="info-field">
                    <span className="info-label">Department</span>
                    <span className="info-value">{user?.department || 'Not specified'}</span>
                  </div>
                  <div className="info-field">
                    <span className="info-label">Role</span>
                    <span className="info-value capitalize">{user?.role}</span>
                  </div>
                  {user?.role === 'student' && (
                    <>
                      <div className="info-field">
                        <span className="info-label">Year</span>
                        <span className="info-value">{user?.year || 'Not specified'}</span>
                      </div>
                      <div className="info-field">
                        <span className="info-label">Class Group</span>
                        <span className="info-value">{user?.classGroup || 'Not specified'}</span>
                      </div>
                      <div className="info-field">
                        <span className="info-label">Batch</span>
                        <span className="info-value">{user?.batch || 'Not specified'}</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Classes Tab */}
          {activeTab === 'classes' && renderClasses()}

          {/* Security Tab */}
          {activeTab === 'security' && renderSecurity()}

          {/* Activity Tab */}
          {activeTab === 'activity' && renderActivity()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
