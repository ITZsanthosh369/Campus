const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

/**
 * @desc    Create a new assignment for a course
 * @route   POST /api/v1/assignments
 * @access  Private/Faculty
 */
const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, dueDate, courseId, maxMarks } = req.body;
  const user = req.user;

  if (user.role !== 'faculty') {
    res.status(403);
    throw new Error('Not authorized, faculty only');
  }

  if (!title || !courseId || !dueDate) {
    res.status(400);
    throw new Error('Please provide title, course ID, and due date');
  }

  try {
    // TODO: In production, actually create the assignment in the database
    // Mock response for now
    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment: {
        id: Math.random().toString(36).substring(2, 15),
        title,
        description,
        dueDate,
        courseId,
        maxMarks,
        createdAt: new Date(),
        facultyId: user._id
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error creating assignment: ${error.message}`);
  }
});

/**
 * @desc    Get assignments
 * @route   GET /api/v1/assignments
 * @access  Private (Students and Faculty)
 */
const getAssignments = asyncHandler(async (req, res) => {
  const user = req.user;
  
  // TODO: When database is ready, fetch actual assignments based on user role
  
  // Mock assignments data
  const mockAssignments = [
    {
      _id: "60d21b4667d0d8992e610c85",
      title: "Introduction to JavaScript",
      description: "Complete the JavaScript fundamentals exercises",
      courseName: "Web Development Fundamentals",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      maxMarks: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: "60d21b4667d0d8992e610c86",
      title: "Database Design Project",
      description: "Design a normalized database schema for the given case study",
      courseName: "Database Systems",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      maxMarks: 150,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: "60d21b4667d0d8992e610c87",
      title: "Operating Systems Lab",
      description: "Complete the process scheduling simulation",
      courseName: "Operating Systems",
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      maxMarks: 75,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  res.status(200).json({
    success: true,
    assignments: mockAssignments
  });
});

module.exports = {
  createAssignment,
  getAssignments
};
