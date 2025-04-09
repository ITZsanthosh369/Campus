import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, 
  Spinner, Alert, Table, Badge 
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const RoleManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock user data
  const mockUsers = [
    { id: 1, name: 'John Smith', email: 'jsmith@campus.edu', role: 'student', department: 'Computer Science' },
    { id: 2, name: 'Sarah Johnson', email: 'sjohnson@campus.edu', role: 'faculty', department: 'Computer Science' },
    { id: 3, name: 'Dr. Michael Lee', email: 'mlee@campus.edu', role: 'hod', department: 'Electrical Engineering' },
    { id: 4, name: 'Prof. Amanda Taylor', email: 'ataylor@campus.edu', role: 'faculty', department: 'Mathematics' },
    { id: 5, name: 'Raj Patel', email: 'rpatel@campus.edu', role: 'student', department: 'Computer Science' },
    { id: 6, name: 'Emma Wilson', email: 'ewilson@campus.edu', role: 'student', department: 'Mechanical Engineering' },
    { id: 7, name: 'Dr. James Rodriguez', email: 'jrodriguez@campus.edu', role: 'hod', department: 'Computer Science' },
    { id: 8, name: 'Linda Chen', email: 'lchen@campus.edu', role: 'faculty', department: 'Physics' },
    { id: 9, name: 'Robert Garcia', email: 'rgarcia@campus.edu', role: 'student', department: 'Mathematics' }
  ];

  // Function to handle loading users
  const handleLoadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle role change
  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    );
    
    setUsers(updatedUsers);
    handleSearch({ target: { value: searchTerm } }, updatedUsers);
  };

  // Function to handle role save
  const handleSaveRole = (user) => {
    console.log(`Role change saved for ${user.name}: ${user.role}`);
    // Here we would make an API call to update the user's role
  };

  // Function to handle search
  const handleSearch = (e, userList = users) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredUsers(userList);
    } else {
      const filtered = userList.filter(user => 
        user.name.toLowerCase().includes(term.toLowerCase()) || 
        user.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // Helper function to get badge color based on role
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'student': return 'primary';
      case 'faculty': return 'success';
      case 'hod': return 'warning';
      case 'principal': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Role Management</h1>
      <p className="text-muted mb-4">
        Manage user roles across the institution. Changes require confirmation.
      </p>
      
      <Card className="shadow-sm mb-4">
        <Card.Header>
          <h4>User Management</h4>
        </Card.Header>
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={handleSearch}
                className="mb-3 mb-md-0"
              />
            </Col>
            <Col md={6} className="text-md-end">
              <Button 
                variant="primary" 
                onClick={handleLoadUsers} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Loading...
                  </>
                ) : 'Load Users'}
              </Button>
            </Col>
          </Row>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          {loading && !users.length ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-2">Loading users...</p>
            </div>
          ) : (
            <>
              {filteredUsers.length === 0 ? (
                <Alert variant="info">
                  {users.length === 0 
                    ? "No users loaded. Click 'Load Users' to begin." 
                    : "No users match your search."}
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Current Role</th>
                        <th>New Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.department}</td>
                          <td>
                            <Badge bg={getRoleBadgeColor(user.role)} className="text-uppercase">
                              {user.role}
                            </Badge>
                          </td>
                          <td>
                            <Form.Select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              size="sm"
                            >
                              <option value="student">Student</option>
                              <option value="faculty">Faculty</option>
                              <option value="hod">HOD</option>
                              <option value="principal">Principal</option>
                            </Form.Select>
                          </td>
                          <td>
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => handleSaveRole(user)}
                            >
                              Save
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Information Card */}
      <Card className="shadow-sm">
        <Card.Header>
          <h4>Role Information</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <h5>Role Descriptions</h5>
              <ul className="list-unstyled">
                <li><Badge bg="primary" className="me-2">Student</Badge> Access to classes and submissions</li>
                <li><Badge bg="success" className="me-2">Faculty</Badge> Manage courses and grade assignments</li>
                <li><Badge bg="warning" className="me-2">HOD</Badge> Department administration and oversight</li>
                <li><Badge bg="danger" className="me-2">Principal</Badge> Institution-wide administration</li>
              </ul>
            </Col>
            <Col md={6}>
              <h5>Role Change Policy</h5>
              <p className="text-muted">
                Role changes require proper verification of the user's position in the institution.
                Please ensure all changes are authorized and documented appropriately.
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RoleManagement;
