const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

/**
 * @desc    Submit a query to faculty
 * @route   POST /api/v1/queries
 * @access  Private/Student
 */
const submitQuery = asyncHandler(async (req, res) => {
  const { courseId, courseName, facultyId, subject, message } = req.body;
  const user = req.user;

  if (user.role !== 'student') {
    res.status(403);
    throw new Error('Not authorized, student only');
  }

  if (!courseId || !courseName || !subject || !message) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  try {
    // TODO: In production, actually save the query to database
    // Mock response for now
    res.status(201).json({
      success: true,
      message: 'Query submitted successfully',
      query: {
        id: Math.random().toString(36).substring(2, 15),
        courseId,
        courseName,
        studentId: user._id,
        studentName: user.name,
        facultyId, // Optional
        subject,
        message,
        status: 'pending',
        submittedAt: new Date(),
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error submitting query: ${error.message}`);
  }
});

/**
 * @desc    Get queries submitted by student
 * @route   GET /api/v1/queries/my-queries
 * @access  Private/Student
 */
const getMyQueries = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== 'student') {
    res.status(403);
    throw new Error('Not authorized, student only');
  }

  try {
    // TODO: In production, fetch actual queries from database
    // Mock data for now
    const queries = [
      {
        _id: '60d5ec9d8e8a8d2b9c9a7777',
        courseId: '60d5ec9d8e8a8d2b9c9a2345',
        courseName: 'Introduction to Programming',
        studentId: user._id,
        studentName: user.name,
        facultyId: '60d5ec9d8e8a8d2b9c9a7890',
        subject: 'Assignment Clarification',
        message: 'I need clarification on question 3 of the midterm assignment.',
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        _id: '60d5ec9d8e8a8d2b9c9a8888',
        courseId: '60d5ec9d8e8a8d2b9c9a3456',
        courseName: 'Data Structures',
        studentId: user._id,
        studentName: user.name,
        facultyId: '60d5ec9d8e8a8d2b9c9a8901',
        subject: 'Lab Report Extension',
        message: 'Can I have a 2-day extension for the lab report submission?',
        status: 'answered',
        response: 'Yes, you can submit by Friday.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    res.status(200).json({
      success: true,
      queries
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error retrieving queries: ${error.message}`);
  }
});

/**
 * @desc    Get student queries for faculty
 * @route   GET /api/v1/queries
 * @access  Private/Faculty
 */
const getStudentQueries = asyncHandler(async (req, res) => {
  const user = req.user;
  const { courseId } = req.query;

  if (user.role !== 'faculty' && user.role !== 'hod' && user.role !== 'principal') {
    res.status(403);
    throw new Error('Not authorized');
  }

  try {
    // TODO: In production, fetch actual queries from database based on faculty ID
    // Mock data for now
    const queries = [
      {
        _id: '60d5ec9d8e8a8d2b9c9a7777',
        courseId: '60d5ec9d8e8a8d2b9c9a2345',
        courseName: 'Introduction to Programming',
        studentId: '60d5ec9d8e8a8d2b9c9a1357',
        studentName: 'Test Student',
        facultyId: user._id,
        subject: 'Assignment Clarification',
        message: 'I need clarification on question 3 of the midterm assignment.',
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    // Filter by courseId if provided
    const filteredQueries = courseId 
      ? queries.filter(query => query.courseId === courseId) 
      : queries;

    res.status(200).json({
      success: true,
      queries: filteredQueries
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error retrieving student queries: ${error.message}`);
  }
});

module.exports = {
  submitQuery,
  getMyQueries,
  getStudentQueries
};
