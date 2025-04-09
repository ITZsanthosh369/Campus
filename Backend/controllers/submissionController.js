const asyncHandler = require('express-async-handler');
const Submission = require('../models/submissionModel');
const Assignment = require('../models/assignmentModel');
const User = require('../models/userModel');

/**
 * @desc    Submit an assignment
 * @route   POST /api/v1/submissions
 * @access  Private/Student
 */
const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId, submissionText, submissionTitle } = req.body;
  const user = req.user;

  if (user.role !== 'student') {
    res.status(403);
    throw new Error('Not authorized, student only');
  }

  if (!assignmentId || !submissionText || !submissionTitle) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  try {
    // Check if the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      res.status(404);
      throw new Error('Assignment not found');
    }

    // Check if the student has already submitted this assignment
    const existingSubmission = await Submission.findOne({
      assignmentId,
      studentId: user._id
    });

    if (existingSubmission) {
      res.status(400);
      throw new Error('You have already submitted this assignment');
    }

    // Create a new submission
    const newSubmission = await Submission.create({
      assignmentId,
      studentId: user._id,
      submissionText,
      submissionTitle,
      attachmentUrl: '', // No file upload for now
    });

    res.status(201).json({
      success: true,
      submission: newSubmission
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error submitting assignment: ${error.message}`);
  }
});

/**
 * @desc    Get student's submissions
 * @route   GET /api/v1/submissions/my-submissions
 * @access  Private/Student
 */
const getMySubmissions = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== 'student') {
    res.status(403);
    throw new Error('Not authorized, student only');
  }

  try {
    // Find all submissions by this student
    const submissions = await Submission.find({ studentId: user._id })
      .populate('assignmentId', 'title dueDate maxMarks courseId');

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
  submitAssignment,
  getMySubmissions
};
