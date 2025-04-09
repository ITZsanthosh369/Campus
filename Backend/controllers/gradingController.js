const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

/**
 * @desc    Grade student submissions
 * @route   POST /api/v1/submissions/grade
 * @access  Private/Faculty
 */
const gradeSubmissions = asyncHandler(async (req, res) => {
  const { submissionIds, marks, feedback } = req.body;
  const user = req.user;

  if (user.role !== 'faculty') {
    res.status(403);
    throw new Error('Not authorized, faculty only');
  }

  if (!submissionIds || !Array.isArray(submissionIds) || submissionIds.length === 0) {
    res.status(400);
    throw new Error('Please provide submission IDs');
  }

  try {
    // In a real app, we'd update the submissions with grades and feedback
    
    // Mock response for now
    res.status(200).json({
      success: true,
      message: `Successfully graded ${submissionIds.length} submissions`,
      gradedSubmissions: submissionIds.map(id => ({
        id,
        marks: marks || 'Not specified',
        feedback: feedback || '',
        gradedBy: user._id,
        gradedAt: new Date()
      }))
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error grading submissions: ${error.message}`);
  }
});

/**
 * @desc    Get submissions for an assignment
 * @route   GET /api/v1/submissions
 * @access  Private/Faculty
 */
const getSubmissions = asyncHandler(async (req, res) => {
  const { assignmentId } = req.query;
  const user = req.user;

  if (user.role !== 'faculty') {
    res.status(403);
    throw new Error('Not authorized, faculty only');
  }

  if (!assignmentId) {
    res.status(400);
    throw new Error('Please provide assignment ID');
  }

  try {
    // Mock data for now
    const submissions = [
      {
        id: '1',
        assignmentId,
        studentId: '101',
        studentName: 'John Doe',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        fileUrl: 'https://example.com/submission1.pdf',
        graded: false
      },
      {
        id: '2',
        assignmentId,
        studentId: '102',
        studentName: 'Jane Smith',
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        fileUrl: 'https://example.com/submission2.pdf',
        graded: false
      }
    ];

    res.status(200).json({
      success: true,
      submissions
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error retrieving submissions: ${error.message}`);
  }
});

module.exports = {
  gradeSubmissions,
  getSubmissions
};
