import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/apiUtils'; // Import fetchWithAuth
import ChatModal from '../components/ChatModal';

const FacultyClasses = () => {
  const { user } = useAuth();
  const [classesData, setClassesData] = useState({ classGroups: [], courseGroups: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "class" or "course"
  const [selectedItemName, setSelectedItemName] = useState(""); // holds class or course name
  
  // Chat state variables
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedChatGroup, setSelectedChatGroup] = useState(null);
  const [selectedChatGroupType, setSelectedChatGroupType] = useState(null);
  
  // Mock student list
  const mockStudents = ["Alice Kumar", "John Mathew", "Sneha Raj", "David Lee", "Maria Garcia"];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Use fetchWithAuth instead of axios directly
        const { data, error } = await fetchWithAuth('/users/my-classes');
        
        if (error) {
          throw new Error(error);
        }
        
        setClassesData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError(err.message || 'Failed to fetch classes');
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Display loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Display error message
  if (error) {
    return (
      <div className="p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-2">My Classes</h1>
        </header>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Display no classes found message
  if (!classesData.success || 
      (classesData.classGroups?.length === 0 && classesData.courseGroups?.length === 0)) {
    return (
      <div className="p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-2">My Classes</h1>
          <p className="text-gray-600 italic">No classes or courses assigned.</p>
        </header>
      </div>
    );
  }

  // Function to handle opening the chat modal
  const handleOpenChat = (group, type) => {
    setSelectedChatGroup(group);
    setSelectedChatGroupType(type);
    setIsChatModalOpen(true);
  };

  // Function to close the chat modal
  const handleCloseChat = () => {
    setIsChatModalOpen(false);
    setSelectedChatGroup(null);
    setSelectedChatGroupType(null);
  };

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Classes</h1>
        <p className="text-gray-600">Classes and courses you are assigned to teach or manage</p>
      </header>

      {/* Class Groups Section */}
      {classesData.classGroups?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Assigned Class Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {classesData.classGroups.map((classGroup) => (
              <div key={classGroup._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{classGroup.name}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {classGroup.userRole === 'faculty' ? 
                      (classGroup.programCoordinator?._id === user?._id ? 'Coordinator' : 'Tutor') : 
                      classGroup.userRole}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Year:</strong> {classGroup.year}</p>
                  <p><strong>Batch:</strong> {classGroup.batch}</p>
                  <p><strong>Department:</strong> {classGroup.department}</p>
                  <p><strong>Students:</strong> {classGroup.studentCount || 'Not available'}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button 
                    className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-200 mr-2"
                    onClick={() => {
                      setSelectedItemName(classGroup.name);
                      setModalType("class");
                      setIsModalOpen(true);
                    }}
                  >
                    Manage Class
                  </button>
                  <button 
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200"
                    onClick={() => { setSelectedClass(classGroup.name); setIsModalOpen(true); }}
                  >
                    View Students
                  </button>
                  {/* Add Chat button */}
                  <button
                    className="mt-2 text-sm bg-blue-600 text-white px-2 py-1 rounded ml-2 hover:bg-blue-700 transition duration-200"
                    onClick={() => handleOpenChat(classGroup, 'ClassGroup')}
                  >
                    <span className="inline-block md:text-sm lg:text-xs">💬</span>
                    <span className="ml-1">Chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Course Groups Section */}
      {classesData.courseGroups?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Assigned Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classesData.courseGroups.map((course) => (
              <div key={course._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{course.courseCode}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Instructor
                  </span>
                </div>
                <h4 className="text-lg mb-3">{course.courseName}</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Semester:</strong> {course.semester}</p>
                  {course.classGroup && (
                    <p><strong>Assigned Class:</strong> {course.classGroup.name}</p>
                  )}
                  <p><strong>Students:</strong> {course.studentCount || 'Not available'}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button 
                    className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-200"
                    onClick={() => {
                      setSelectedItemName(course.courseCode);
                      setModalType("course");
                      setIsModalOpen(true);
                    }}
                  >
                    Manage Course
                  </button>
                  {/* Add Chat button */}
                  <button
                    className="mt-2 text-sm bg-blue-600 text-white px-2 py-1 rounded ml-2 hover:bg-blue-700 transition duration-200"
                    onClick={() => handleOpenChat(course, 'CourseGroup')}
                  >
                    <span className="inline-block md:text-sm lg:text-xs">💬</span>
                    <span className="ml-1">Chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Student Modal */}
      {selectedClass && !modalType && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Students in {selectedClass}</h2>
            <ul className="list-disc list-inside space-y-2">
              {mockStudents.map((student, idx) => (
                <li key={idx}>{student}</li>
              ))}
            </ul>
            <button
              className="mt-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Management Modal */}
      {modalType && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Manage {modalType === "class" ? "Class" : "Course"}: {selectedItemName}
            </h2>
            <p className="text-gray-600 mb-4">
              This will allow faculty to edit {modalType} details, view analytics, assign materials, etc.
              This is a placeholder for now.
            </p>
            <button
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              onClick={() => { setIsModalOpen(false); setModalType(""); }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Replace the Chat Modal with the new ChatModal component */}
      {selectedChatGroup && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={handleCloseChat}
          groupId={selectedChatGroup._id}
          groupType={selectedChatGroupType}
          group={selectedChatGroup}
        />
      )}
    </div>
  );
};

export default FacultyClasses;
