import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatModal from '../components/ChatModal';
import { fetchWithAuth } from '../utils/apiUtils';

const StudentClasses = () => {
  const { user } = useAuth();
  const [classesData, setClassesData] = useState({ classGroups: [], courseGroups: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add new state variables for faculty modal
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [selectedClassGroupName, setSelectedClassGroupName] = useState('');
  // Renamed from showChat to isChatModalOpen for consistency
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupType, setSelectedGroupType] = useState(null);

  // Mock faculty list for the modal
  const mockFacultyList = [
    "Dr. Rajesh Sharma - Program Coordinator",
    "Prof. Anita Desai - Mathematics",
    "Dr. Michael Chen - Computer Science",
    "Prof. Sunita Patel - Engineering Sciences",
    "Dr. David Wilson - Physics"
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        // Update API call to remove duplicate /api/v1 prefix
        const { data, error } = await fetchWithAuth('/users/my-classes');
        
        if (error) {
          throw new Error(error);
        }
        
        // Ensure we're accessing the correct properties in the response
        setClassesData({
          classGroups: data?.classGroups || [],
          courseGroups: data?.courseGroups || []
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError(err.message || 'Failed to fetch classes');
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Function to handle opening chat for a specific group
  const handleOpenChat = (group, type) => {
    setSelectedGroup(group);
    setSelectedGroupType(type);
    setIsChatModalOpen(true);
  };

  // Function to close chat
  const handleCloseChat = () => {
    setIsChatModalOpen(false);
    setSelectedGroup(null);
    setSelectedGroupType(null);
  };

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

  // Update the condition to check for empty arrays properly
  if (!loading && (!classesData.classGroups?.length && !classesData.courseGroups?.length)) {
    return (
      <div className="p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-2">My Classes</h1>
          <p className="text-gray-600 italic">No classes or courses found.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Classes</h1>
        <p className="text-gray-600">Classes and courses you are enrolled in</p>
      </header>

      {/* Class Groups Section */}
      {classesData.classGroups?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Class Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {classesData.classGroups.map((classGroup) => (
              <div key={classGroup._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{classGroup.name}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {classGroup.userRole}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Year:</strong> {classGroup.year}</p>
                  <p><strong>Batch:</strong> {classGroup.batch}</p>
                  <p><strong>Department:</strong> {classGroup.department}</p>
                  {classGroup.tutor && (
                    <p><strong>Tutor:</strong> {classGroup.tutor.name}</p>
                  )}
                  {classGroup.programCoordinator && (
                    <p><strong>Coordinator:</strong> {classGroup.programCoordinator.name}</p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700">
                    View Details
                  </button>
                  {/* Add View Faculty button */}
                  <button
                    onClick={() => {
                      setSelectedClassGroupName(classGroup.name);
                      setIsFacultyModalOpen(true);
                    }}
                    className="text-sm bg-green-600 text-white px-2 py-1 rounded ml-2 hover:bg-green-700 transition duration-200"
                  >
                    👨‍🏫 View Faculty
                  </button>
                  {/* Add Chat button */}
                  <button
                    onClick={() => handleOpenChat(classGroup, 'ClassGroup')}
                    className="text-sm bg-blue-600 text-white px-2 py-1 rounded ml-2 hover:bg-blue-700 transition duration-200"
                  >
                    💬 Chat
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
          <h2 className="text-xl font-semibold mb-4">Course Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classesData.courseGroups.map((course) => (
              <div key={course._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{course.courseCode}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {course.userRole}
                  </span>
                </div>
                <h4 className="text-lg mb-3">{course.courseName}</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Semester:</strong> {course.semester}</p>
                  {course.faculty && (
                    <p><strong>Faculty:</strong> {course.faculty.name}</p>
                  )}
                  {course.classGroup && (
                    <p><strong>Class:</strong> {course.classGroup.name}</p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700">
                    View Details
                  </button>
                  {/* Add Chat button */}
                  <button
                    onClick={() => handleOpenChat(course, 'CourseGroup')}
                    className="text-sm bg-blue-600 text-white px-2 py-1 rounded ml-2 hover:bg-blue-700 transition duration-200"
                  >
                    💬 Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Faculty Modal */}
      {isFacultyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Faculty for {selectedClassGroupName}
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              {mockFacultyList.map((faculty, index) => (
                <li key={index}>{faculty}</li>
              ))}
            </ul>
            <button
              onClick={() => setIsFacultyModalOpen(false)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Replace the Chat Modal with the new ChatModal component */}
      {selectedGroup && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={handleCloseChat}
          groupId={selectedGroup._id}
          groupType={selectedGroupType}
          group={selectedGroup}
        />
      )}
    </div>
  );
};

export default StudentClasses;
