import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatModal from '../components/ChatModal';

const DepartmentManagement = () => {
  const { user } = useAuth();
  const [departmentData, setDepartmentData] = useState({
    name: '',
    facultyCount: 0,
    studentCount: 0,
    faculty: [],
    students: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chat modal state
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Mock fetching department data
    const fetchDepartmentData = async () => {
      try {
        // In a real implementation, this would be an API call
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock department data
        const mockDepartmentData = {
          name: user?.department || 'Computer Science',
          facultyCount: 12,
          studentCount: 245,
          faculty: [
            { id: 1, name: 'Dr. Anita Desai', email: 'adesai@campus.edu', role: 'Associate Professor', specialization: 'Artificial Intelligence' },
            { id: 2, name: 'Prof. John Mathews', email: 'jmathews@campus.edu', role: 'Assistant Professor', specialization: 'Network Security' },
            { id: 3, name: 'Dr. Sarah Wong', email: 'swong@campus.edu', role: 'Professor', specialization: 'Database Systems' },
            { id: 4, name: 'Dr. Michael Chen', email: 'mchen@campus.edu', role: 'Associate Professor', specialization: 'Software Engineering' },
            { id: 5, name: 'Prof. Lisa Rodriguez', email: 'lrodriguez@campus.edu', role: 'Assistant Professor', specialization: 'Human-Computer Interaction' },
            { id: 6, name: 'Dr. Ahmed Hassan', email: 'ahassan@campus.edu', role: 'Professor', specialization: 'Machine Learning' },
          ],
          students: [
            { id: 101, name: 'Ravi Kumar', email: 'rkumar@student.campus.edu', year: 3, batch: 'A', classGroup: 'CS-2021-A' },
            { id: 102, name: 'Priya Singh', email: 'psingh@student.campus.edu', year: 2, batch: 'B', classGroup: 'CS-2022-B' },
            { id: 103, name: 'Alex Johnson', email: 'ajohnson@student.campus.edu', year: 4, batch: 'A', classGroup: 'CS-2020-A' },
            { id: 104, name: 'Maya Patel', email: 'mpatel@student.campus.edu', year: 1, batch: 'C', classGroup: 'CS-2023-C' },
            { id: 105, name: 'David Lee', email: 'dlee@student.campus.edu', year: 3, batch: 'A', classGroup: 'CS-2021-A' },
            { id: 106, name: 'Sophia Martinez', email: 'smartinez@student.campus.edu', year: 2, batch: 'B', classGroup: 'CS-2022-B' },
            { id: 107, name: 'Omar Farooq', email: 'ofarooq@student.campus.edu', year: 1, batch: 'A', classGroup: 'CS-2023-A' },
            { id: 108, name: 'Emma Wilson', email: 'ewilson@student.campus.edu', year: 4, batch: 'B', classGroup: 'CS-2020-B' },
          ]
        };
        
        setDepartmentData(mockDepartmentData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching department data:', err);
        setError('Failed to load department data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [user]);

  // Open chat with a user
  const handleOpenChat = (user) => {
    setSelectedUser(user);
    setIsChatModalOpen(true);
  };

  // Close chat modal
  const handleCloseChat = () => {
    setIsChatModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Department Management</h1>
        <p className="text-gray-600">Manage faculty and students in your department</p>
      </header>

      {/* Department Overview Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">{departmentData.name} Department</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-indigo-50 rounded-lg text-center">
            <h3 className="text-gray-500 text-sm mb-1">Department</h3>
            <p className="text-xl font-bold text-indigo-600">{departmentData.name}</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg text-center">
            <h3 className="text-gray-500 text-sm mb-1">Faculty Members</h3>
            <p className="text-xl font-bold text-indigo-600">{departmentData.facultyCount}</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg text-center">
            <h3 className="text-gray-500 text-sm mb-1">Students</h3>
            <p className="text-xl font-bold text-indigo-600">{departmentData.studentCount}</p>
          </div>
        </div>
      </div>

      {/* Faculty Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Department Faculty</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentData.faculty.map((faculty) => (
            <div key={faculty.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{faculty.name}</h3>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Faculty
                </span>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Role:</strong> {faculty.role}</p>
                <p><strong>Email:</strong> {faculty.email}</p>
                <p><strong>Specialization:</strong> {faculty.specialization}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                  onClick={() => handleOpenChat(faculty)}
                >
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Students Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Department Students</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentData.students.map((student) => (
            <div key={student.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{student.name}</h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Student
                </span>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Year:</strong> {student.year}</p>
                <p><strong>Class Group:</strong> {student.classGroup}</p>
                <p><strong>Batch:</strong> {student.batch}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                  onClick={() => handleOpenChat(student)}
                >
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chat Modal */}
      {selectedUser && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={handleCloseChat}
          groupId={`direct-${selectedUser.id}`}
          groupType="DirectMessage"
          group={{
            name: selectedUser.name,
            _id: `direct-${selectedUser.id}`
          }}
        />
      )}
    </div>
  );
};

export default DepartmentManagement;
