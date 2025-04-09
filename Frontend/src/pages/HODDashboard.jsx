import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatModal from '../components/ChatModal';

const HODDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for modals
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isDepartmentGroupsModalOpen, setIsDepartmentGroupsModalOpen] = useState(false);
  const [selectedChatGroup, setSelectedChatGroup] = useState(null);
  
  // Mock loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock department groups data
  const departmentGroups = [
    { id: 1, name: "Faculty Group", description: "All faculty members in the department" },
    { id: 2, name: "Research Committee", description: "Department research coordination" },
    { id: 3, name: "Curriculum Development", description: "Course planning and development" },
    { id: 4, name: "Department Events", description: "Seminars and department functions" },
  ];

  // Mock announcements data
  const departmentAnnouncements = [
    {
      id: 1,
      title: 'Faculty Meeting Schedule',
      content: 'Monthly faculty meeting will be held on October 5th at 2:00 PM in the conference room.',
      date: '2023-09-28'
    },
    {
      id: 2,
      title: 'Research Grant Applications',
      content: 'Deadline for internal research grant applications is October 15th. Please submit your proposals to the department office.',
      date: '2023-09-25'
    },
    {
      id: 3,
      title: 'Curriculum Review',
      content: 'Department curriculum review session is scheduled for next week. All course coordinators should prepare their course outlines.',
      date: '2023-09-22'
    },
    {
      id: 4,
      title: 'New Equipment Arrival',
      content: 'The new laboratory equipment has arrived. Training sessions will be conducted next Monday.',
      date: '2023-09-20'
    }
  ];

  // Function to handle opening chat with principal
  const handleOpenPrincipalChat = () => {
    // Mock principal group data - would come from API in real implementation
    const principalGroup = {
      _id: "principal-chat-id",
      name: "Principal's Office",
      members: [user?._id, "principal-id"]
    };
    
    setSelectedChatGroup(principalGroup);
    setIsChatModalOpen(true);
  };

  // Function to close chat modal
  const handleCloseChatModal = () => {
    setIsChatModalOpen(false);
    setSelectedChatGroup(null);
  };

  // Function to open department groups modal
  const handleOpenDepartmentGroups = () => {
    setIsDepartmentGroupsModalOpen(true);
  };

  // Function to handle selecting a department group for chat
  const handleSelectDepartmentGroup = (group) => {
    // Convert to format expected by ChatModal
    const chatGroup = {
      _id: `department-group-${group.id}`,
      name: group.name,
      description: group.description
    };
    
    setSelectedChatGroup(chatGroup);
    setIsDepartmentGroupsModalOpen(false);
    setIsChatModalOpen(true);
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
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray">Head of Department Dashboard</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Information Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Department Information</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Department:</strong> {user?.department}</p>
            <p><strong>Role:</strong> Head of Department</p>
          </div>
        </div>

        {/* Department Announcements Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Department Announcements</h2>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {departmentAnnouncements.map(announcement => (
              <div key={announcement.id} className="pb-3 border-b border-gray-200 last:border-0">
                <h3 className="font-medium">{announcement.title}</h3>
                <p className="my-1 text-sm">{announcement.content}</p>
                <p className="text-xs text-gray-500">{new Date(announcement.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Navigation Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Department Management</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => navigate('/hod/department')} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            🏢 My Department
          </button>
          <button 
            onClick={handleOpenPrincipalChat}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            💬 Message Principal
          </button>
          <button
            onClick={handleOpenDepartmentGroups}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            👥 Department Groups
          </button>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Department Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm">Faculty Members</h3>
            <p className="text-2xl font-bold text-indigo-600">12</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm">Active Courses</h3>
            <p className="text-2xl font-bold text-indigo-600">18</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm">Student Enrollment</h3>
            <p className="text-2xl font-bold text-indigo-600">245</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm">Research Projects</h3>
            <p className="text-2xl font-bold text-indigo-600">7</p>
          </div>
        </div>
      </div>

      {/* Principal Chat Modal */}
      {selectedChatGroup && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={handleCloseChatModal}
          groupId={selectedChatGroup._id}
          groupType="AdminGroup"
          group={selectedChatGroup}
        />
      )}

      {/* Department Groups Modal */}
      {isDepartmentGroupsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">Department Groups</h2>
            <ul className="space-y-2">
              {departmentGroups.map((group) => (
                <li 
                  key={group.id} 
                  className="p-3 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => handleSelectDepartmentGroup(group)}
                >
                  <h3 className="font-medium">{group.name}</h3>
                  <p className="text-sm text-gray-600">{group.description}</p>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsDepartmentGroupsModalOpen(false)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HODDashboard;
