import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, 
  Modal, Form, Spinner, Alert 
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const PrincipalDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stats state
  const [stats, setStats] = useState({
    totalDepartments: 0,
    totalFaculty: 0,
    totalStudents: 0
  });
  
  // Modal states
  const [showDepartmentsModal, setShowDepartmentsModal] = useState(false);
  const [showCircularModal, setShowCircularModal] = useState(false);
  
  // Mock data
  const [departments, setDepartments] = useState([]);
  const [circular, setCircular] = useState({
    title: '',
    message: '',
    recipients: 'all' // all, faculty, students
  });

  // Fetch mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(r => setTimeout(r, 1000));
        
        // Mock data
        setStats({
          totalDepartments: 8,
          totalFaculty: 120,
          totalStudents: 2500
        });
        
        setDepartments([
          { id: 1, name: 'Computer Science', hod: 'Dr. Smith', faculty: 15, students: 300 },
          { id: 2, name: 'Electrical Engineering', hod: 'Dr. Johnson', faculty: 18, students: 250 },
          { id: 3, name: 'Mechanical Engineering', hod: 'Dr. Brown', faculty: 20, students: 280 },
        ]);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle circular submission
  const handleCircularSubmit = (e) => {
    e.preventDefault();
    // Mock sending circular
    alert(`Circular "${circular.title}" sent to ${circular.recipients}`);
    setShowCircularModal(false);
    setCircular({ title: '', message: '', recipients: 'all' });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" />
        <span className="ms-2">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Welcome, {user?.name || 'Principal'}</h1>
      
      {/* Stats Overview */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <h2 className="display-4">{stats.totalDepartments}</h2>
              <p className="text-muted">Total Departments</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <h2 className="display-4">{stats.totalFaculty}</h2>
              <p className="text-muted">Total Faculty</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <h2 className="display-4">{stats.totalStudents}</h2>
              <p className="text-muted">Total Students</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Quick Access Buttons */}
      <Card className="shadow-sm mb-4">
        <Card.Header>
          <h4>Quick Actions</h4>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Button 
                variant="outline-primary" 
                className="w-100 py-3"
                onClick={() => setShowDepartmentsModal(true)}
              >
                View Departments
              </Button>
            </Col>
            
            <Col md={4}>
              <Button 
                variant="outline-success" 
                className="w-100 py-3"
                onClick={() => setShowCircularModal(true)}
              >
                Send Circular
              </Button>
            </Col>
            
            <Col md={4}>
              <Button variant="outline-secondary" className="w-100 py-3">
                Manage Roles
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Departments Modal */}
      <Modal size="lg" show={showDepartmentsModal} onHide={() => setShowDepartmentsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Departments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>HOD</th>
                <th>Faculty</th>
                <th>Students</th>
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => (
                <tr key={dept.id}>
                  <td>{dept.name}</td>
                  <td>{dept.hod}</td>
                  <td>{dept.faculty}</td>
                  <td>{dept.students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
      
      {/* Send Circular Modal */}
      <Modal show={showCircularModal} onHide={() => setShowCircularModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Circular</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCircularSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={circular.title}
                onChange={(e) => setCircular({...circular, title: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={circular.message}
                onChange={(e) => setCircular({...circular, message: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Recipients</Form.Label>
              <Form.Select
                value={circular.recipients}
                onChange={(e) => setCircular({...circular, recipients: e.target.value})}
              >
                <option value="all">All</option>
                <option value="faculty">Faculty Only</option>
                <option value="students">Students Only</option>
              </Form.Select>
            </Form.Group>
            
            <Button type="submit" className="w-100">
              Send Circular
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PrincipalDashboard;
