const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const CourseGroup = require('../models/courseGroupModel');

/**
 * @desc    Mark attendance for a class
 * @route   POST /api/v1/attendance
 * @access  Private/Faculty
 */
const markAttendance = asyncHandler(async (req, res) => {
  const { courseId, date, presentStudents, absentStudents } = req.body;
  const user = req.user;

  if (user.role !== 'faculty') {
    res.status(403);
    throw new Error('Not authorized, faculty only');
  }

  if (!courseId || !presentStudents) {
    res.status(400);
    throw new Error('Please provide course ID and attendance data');
  }

  try {
    // In a real app, we'd check if the course exists and faculty is assigned to it
    // Then record the attendance in the database

    // Mock response for now
    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance: {
        id: Math.random().toString(36).substring(2, 15),
        courseId,
        date: date || new Date(),
        presentStudents,
        absentStudents,
        markedBy: user._id
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error marking attendance: ${error.message}`);
  }
});

/**
 * @desc    Get attendance for a course
 * @route   GET /api/v1/attendance
 * @access  Private/Faculty
 */
const getAttendance = asyncHandler(async (req, res) => {
  const { courseId, startDate, endDate } = req.query;
  const user = req.user;

  if (user.role !== 'faculty') {
    res.status(403);
    throw new Error('Not authorized, faculty only');
  }

  if (!courseId) {
    res.status(400);
    throw new Error('Please provide course ID');
  }

  try {
    // Mock data for now
    const attendance = [
      {
        id: '1',
        courseId,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        presentStudents: [
          { id: '101', name: 'John Doe' },
          { id: '102', name: 'Jane Smith' }
        ],
        absentStudents: [
          { id: '103', name: 'Robert Johnson' }
        ]
      },
      {
        id: '2',
        courseId,
        date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        presentStudents: [
          { id: '101', name: 'John Doe' },
          { id: '103', name: 'Robert Johnson' }
        ],
        absentStudents: [
          { id: '102', name: 'Jane Smith' }
        ]
      }
    ];

    res.status(200).json({
      success: true,
      attendance
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error retrieving attendance: ${error.message}`);
  }
});

module.exports = {
  markAttendance,
  getAttendance
};
