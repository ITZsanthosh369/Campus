import React from 'react';
import ChatInterface from './ChatInterface';

/**
 * Reusable chat modal component
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to call when modal is closed
 * @param {string} groupId - ID of the group for the chat
 * @param {string} groupType - Type of group ('ClassGroup' or 'CourseGroup')
 * @param {object} group - The group object containing name/title information
 */
const ChatModal = ({ isOpen, onClose, groupId, groupType, group }) => {
  if (!isOpen) return null;

  // Determine title based on group type
  const title = groupType === 'ClassGroup' 
    ? `Chat - ${group.name}` 
    : `Chat - ${group.courseCode}: ${group.courseName}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl transform transition-transform duration-300">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition duration-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <ChatInterface 
            groupType={groupType} 
            groupId={groupId} 
          />
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
