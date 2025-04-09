const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const Department = require('../models/departmentModel');
const ClassGroup = require('../models/classGroupModel');
const CourseGroup = require('../models/courseGroupModel');

/**
 * Determine if a user has access to a particular group based on role hierarchy
 */
const hasAccessToGroup = async (user, groupType, groupId) => {
  // Admin users don't have access to messages (as per requirements)
  if (user.role === 'admin') {
    return false;
  }
  
  switch (groupType) {
    case 'Department':
      const department = await Department.findById(groupId);
      if (!department) return false;
      
      // HOD has access to department
      if (user.role === 'hod' && department.hod && department.hod.equals(user._id)) return true;
      
      // Faculty members have access to their department
      if (user.role === 'faculty' && department.faculties && department.faculties.some(id => id.equals(user._id))) return true;
      
      // Students have access to their department
      if (user.role === 'student' && department.students && department.students.some(id => id.equals(user._id))) return true;
      
      return false;
      
    case 'ClassGroup':
      const classGroup = await ClassGroup.findById(groupId);
      if (!classGroup) return false;
      
      // Program coordinator has access to class groups they coordinate
      if (classGroup.programCoordinator?.equals(user._id)) return true;
      
      // Tutor has access to their class group
      if (classGroup.tutor?.equals(user._id)) return true;
      
      // Students have access to their class group
      if (user.role === 'student' && classGroup.students.includes(user._id)) return true;
      
      return false;
      
    case 'CourseGroup':
      const courseGroup = await CourseGroup.findById(groupId);
      if (!courseGroup) return false;
      
      // Faculty assigned to the course has access
      if (courseGroup.faculty && courseGroup.faculty.equals(user._id)) return true;
      
      // Students in the course have access
      if (user.role === 'student' && courseGroup.students.includes(user._id)) return true;
      
      return false;
      
    default:
      return false;
  }
};

/**
 * @desc    Send a message to a group
 * @route   POST /api/v1/messages/send
 * @access  Private
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { groupType, groupId, content } = req.body;
  const user = req.user;
  
  // Basic validation
  if (!groupType || !groupId || !content) {
    res.status(400);
    throw new Error('Please provide groupType, groupId and content');
  }

  // Admin users cannot send messages
  if (user.role === 'admin') {
    res.status(403);
    throw new Error('Admin users are not allowed to send messages');
  }

  // Check if user has access to the group
  const hasAccess = await hasAccessToGroup(user, groupType, groupId);
  if (!hasAccess) {
    res.status(403);
    throw new Error('You do not have permission to send messages to this group');
  }

  try {
    const message = await Message.create({
      sender: user._id,
      senderName: user.name,
      senderRole: user.role,
      groupType,
      groupId,
      content,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error sending message: ${error.message}`);
  }
});

/**
 * @desc    Get messages from a group
 * @route   GET /api/v1/messages
 * @access  Private
 */
const getMessages = asyncHandler(async (req, res) => {
  const { groupType, groupId } = req.query;
  const { page = 1, limit = 50 } = req.query;
  const user = req.user;
  
  // Basic validation
  if (!groupType || !groupId) {
    res.status(400);
    throw new Error('Please provide groupType and groupId');
  }

  // Admin users cannot access messages
  if (user.role === 'admin') {
    res.status(403);
    throw new Error('Admin users are not allowed to read messages');
  }

  // Check if user has access to the group
  const hasAccess = await hasAccessToGroup(user, groupType, groupId);
  if (!hasAccess) {
    res.status(403);
    throw new Error('You do not have permission to access messages from this group');
  }

  try {
    // Get messages with pagination
    const messages = await Message.find({ groupType, groupId })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Message.countDocuments({ groupType, groupId });
    
    res.status(200).json({
      success: true,
      messages,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error retrieving messages: ${error.message}`);
  }
});

module.exports = {
  sendMessage,
  getMessages,
  hasAccessToGroup // Export for testing
};
