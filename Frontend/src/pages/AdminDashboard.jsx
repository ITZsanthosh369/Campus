import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    totalRoles: 0
  });
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'edit', 'role', 'delete'
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
    department: ''
  });

  // Mock function to simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(r => setTimeout(r, 1000));
        
        // Mock users data
        const mockUsers = [
          { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'admin', status: 'active', department: 'IT' },
          { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'faculty', status: 'active', department: 'Computer Science' },
          { id: 3, name: 'Robert Johnson', email: 'robert.johnson@example.com', role: 'hod', status: 'active', department: 'Mathematics' },
          { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'student', status: 'inactive', department: 'Physics' },
          { id: 5, name: 'Michael Brown', email: 'michael.brown@example.com', role: 'faculty', status: 'active', department: 'Chemistry' },
          { id: 6, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'student', status: 'active', department: 'Biology' },
          { id: 7, name: 'David Taylor', email: 'david.taylor@example.com', role: 'principal', status: 'active', department: 'Administration' },
          { id: 8, name: 'Jennifer Miller', email: 'jennifer.miller@example.com', role: 'faculty', status: 'inactive', department: 'English' },
          { id: 9, name: 'Richard Anderson', email: 'richard.anderson@example.com', role: 'student', status: 'active', department: 'History' },
          { id: 10, name: 'Susan Thomas', email: 'susan.thomas@example.com', role: 'faculty', status: 'active', department: 'Arts' },
          { id: 11, name: 'Paul Jackson', email: 'paul.jackson@example.com', role: 'hod', status: 'active', department: 'Economics' },
          { id: 12, name: 'Linda White', email: 'linda.white@example.com', role: 'student', status: 'inactive', department: 'Psychology' },
        ];
        
        setUsers(mockUsers);
        
        // Set stats
        setStats({
          totalUsers: mockUsers.length,
          activeUsers: mockUsers.filter(user => user.status === 'active').length,
          pendingApprovals: 3,
          totalRoles: 5 // admin, faculty, hod, principal, student
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load users data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.department.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      department: user.department
    });
    setModalType('edit');
    setIsModalOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setConfirmationMessage(`Are you sure you want to delete ${user.name}?`);
    setModalType('delete');
    setShowConfirmation(true);
    setIsModalOpen(true);
  };

  // Handle assign role
  const handleAssignRole = (user) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      role: user.role
    });
    setModalType('role');
    setIsModalOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user based on modal type
    if (modalType === 'edit') {
      // Simulate API update
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id ? { ...u, ...formData } : u
      );
      setUsers(updatedUsers);
      setAlertMessage('User updated successfully!');
      setAlertType('success');
    } else if (modalType === 'role') {
      // Simulate API update for role change only
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id ? { ...u, role: formData.role } : u
      );
      setUsers(updatedUsers);
      setAlertMessage('Role assigned successfully!');
      setAlertType('success');
    }
    
    // Close modal
    setIsModalOpen(false);
    
    // Clear alert after 3 seconds
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 3000);
  };

  // Handle confirmation
  const handleConfirmAction = () => {
    if (modalType === 'delete') {
      // Simulate API delete
      const updatedUsers = users.filter(u => u.id !== selectedUser.id);
      setUsers(updatedUsers);
      setAlertMessage('User deleted successfully!');
      setAlertType('success');
    }
    
    // Close modal
    setIsModalOpen(false);
    setShowConfirmation(false);
    
    // Clear alert after 3 seconds
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 3000);
  };

  // Render user role badge
  const renderRoleBadge = (role) => {
    const badgeClass = `admin-badge badge-${role}`;
    return <span className={badgeClass}>{role}</span>;
  };

  // Render user status badge
  const renderStatusBadge = (status) => {
    const badgeClass = `admin-badge ${status === 'active' ? 'badge-success' : 'badge-inactive'}`;
    return <span className={badgeClass}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-alert admin-alert-danger">
          <div className="admin-alert-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Admin Header Banner */}
      <div className="admin-banner">
        <h1>Admin Dashboard</h1>
        <p>Manage users, roles, and system settings</p>
      </div>

      {/* Alert Message */}
      {alertMessage && (
        <div className={`admin-alert admin-alert-${alertType}`}>
          <div className="admin-alert-icon">
            {alertType === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div>
            <p>{alertMessage}</p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="admin-stat-card">
          <div className="icon" style={{ backgroundColor: '#16a34a' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3>Active Users</h3>
          <p>{stats.activeUsers}</p>
        </div>
        <div className="admin-stat-card">
          <div className="icon" style={{ backgroundColor: '#f59e0b' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3>Pending Approvals</h3>
          <p>{stats.pendingApprovals}</p>
        </div>
        <div className="admin-stat-card">
          <div className="icon" style={{ backgroundColor: '#7c3aed' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3>Total Roles</h3>
          <p>{stats.totalRoles}</p>
        </div>
      </div>

      {/* User Management Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Management
          </h2>
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => {
              setModalType('add');
              setFormData({
                name: '',
                email: '',
                role: 'student',
                status: 'active',
                department: ''
              });
              setIsModalOpen(true);
            }}
          >
            Add User
          </button>
        </div>
        <div className="admin-card-body">
          {/* Search and Filters */}
          <div className="admin-controls">
            <div className="admin-search">
              <label htmlFor="search" className="block text-sm font-medium mb-1 text-gray-700">Search Users</label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="admin-filters">
              <div>
                <label htmlFor="role-filter" className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="faculty">Faculty</option>
                  <option value="hod">HOD</option>
                  <option value="principal">Principal</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium mb-1 text-gray-700">Status</label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="admin-table-container">
            <table className="admin-table admin-table-responsive">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td data-label="Name">{user.name}</td>
                      <td data-label="Email">{user.email}</td>
                      <td data-label="Department">{user.department}</td>
                      <td data-label="Role">{renderRoleBadge(user.role)}</td>
                      <td data-label="Status">{renderStatusBadge(user.status)}</td>
                      <td data-label="Actions">
                        <div className="admin-actions">
                          <button
                            className="admin-btn admin-btn-sm admin-btn-primary"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            onClick={() => handleAssignRole(user)}
                          >
                            Role
                          </button>
                          <button
                            className="admin-btn admin-btn-sm admin-btn-danger"
                            onClick={() => handleDeleteUser(user)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > usersPerPage && (
            <div className="admin-pagination">
              <div className="admin-pagination-info">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
              </div>
              <div className="admin-pagination-controls">
                <button 
                  className={`admin-pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </button>
                
                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    className={`admin-pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button 
                  className={`admin-pagination-btn ${currentPage === Math.ceil(filteredUsers.length / usersPerPage) ? 'disabled' : ''}`}
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            {/* Modal Header */}
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {modalType === 'edit' && 'Edit User'}
                {modalType === 'add' && 'Add New User'}
                {modalType === 'role' && 'Assign Role'}
                {modalType === 'delete' && 'Delete User'}
              </h3>
              <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="admin-modal-body">
              {showConfirmation ? (
                <div className="admin-confirm-dialog">
                  <div className="admin-confirm-icon danger">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h3 className="admin-confirm-title">Confirm Deletion</h3>
                  <p className="admin-confirm-message">{confirmationMessage}</p>
                  <div className="flex justify-center gap-4">
                    <button className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </button>
                    <button className="admin-btn admin-btn-danger" onClick={handleConfirmAction}>
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Common fields for add and edit */}
                  {(modalType === 'add' || modalType === 'edit') && (
                    <>
                      <div className="admin-form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="admin-form-control"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="admin-form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="admin-form-control"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="admin-form-group">
                        <label htmlFor="department">Department</label>
                        <input
                          type="text"
                          id="department"
                          name="department"
                          className="admin-form-control"
                          value={formData.department}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="admin-form-group">
                        <label htmlFor="status">Status</label>
                        <select
                          id="status"
                          name="status"
                          className="admin-form-select"
                          value={formData.status}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  {/* Role selection for add, edit, and role assignment */}
                  {(modalType === 'add' || modalType === 'edit' || modalType === 'role') && (
                    <div className="admin-form-group">
                      <label htmlFor="role">Role</label>
                      <select
                        id="role"
                        name="role"
                        className="admin-form-select"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="admin">Admin</option>
                        <option value="faculty">Faculty</option>
                        <option value="hod">HOD</option>
                        <option value="principal">Principal</option>
                        <option value="student">Student</option>
                      </select>
                    </div>
                  )}
                  
                  {/* Add user fields */}
                  {modalType === 'add' && (
                    <div className="admin-form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="admin-form-control"
                        placeholder="Enter temporary password"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button 
                      type="button" 
                      className="admin-btn admin-btn-outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="admin-btn admin-btn-primary">
                      {modalType === 'add' && 'Add User'}
                      {modalType === 'edit' && 'Save Changes'}
                      {modalType === 'role' && 'Update Role'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
