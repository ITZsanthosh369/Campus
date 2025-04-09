const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

/**
 * @desc    Create a new announcement
 * @route   POST /api/v1/announcements
 * @access  Private/Faculty/HOD/Principal
 */
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, content, targetGroups, targetDepartments, isPinned } = req.body;
  const user = req.user;

  // Only faculty, HOD, and principal can create announcements
  if (!['faculty', 'hod', 'principal'].includes(user.role)) {
    res.status(403);
    throw new Error('Not authorized to create announcements');
  }

  if (!title || !content) {
    res.status(400);
    throw new Error('Please provide title and content');
  }

  try {
    // In a real app, we'd create a new announcement document in the database
    
    // Mock response for now
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement: {
        id: Math.random().toString(36).substring(2, 15),
        title,
        content,
        targetGroups: targetGroups || [],
        targetDepartments: targetDepartments || [],
        createdBy: {
          id: user._id,
          name: user.name,
          role: user.role
        },
        createdAt: new Date(),
        isPinned: isPinned || false
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error creating announcement: ${error.message}`);
  }
});

/**
 * @desc    Get announcements for user
 * @route   GET /api/v1/announcements
 * @access  Private
 */
const getAnnouncements = asyncHandler(async (req, res) => {
  const user = req.user;

  try {
    // In a real app, we'd query announcements based on user's role, department, and groups
    
    // Mock data for now
    const announcements = [
      {
        id: '1',
        title: 'Midterm Examination Schedule',
        content: 'Midterm exams will be conducted from October 15 to October 25. Please check your email for the detailed schedule.',
        createdBy: {
          id: 'admin1',
          name: 'Admin User',
          role: 'admin'
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isPinned: true
      },
      {
        id: '2',
        title: 'Guest Lecture on AI',
        content: 'We are pleased to announce a guest lecture on "Future of AI" by Dr. Jane Smith on November 5, 2023, at 2:00 PM in the Main Auditorium.',
        createdBy: {
          id: 'faculty1',
          name: 'Dr. Robert Johnson',
          role: 'faculty'
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isPinned: false
      }
    ];

    res.status(200).json({
      success: true,
      announcements
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error retrieving announcements: ${error.message}`);
  }
});

/**
 * @desc    Upload a circular
 * @route   POST /api/v1/circulars
 * @access  Private/HOD/Principal
 */
const uploadCircular = asyncHandler(async (req, res) => {
  const { title, description, fileUrl, targetRoles, targetDepartments } = req.body;
  const user = req.user;

  // Only HOD and principal can upload circulars
  if (!['hod', 'principal'].includes(user.role)) {
    res.status(403);
    throw new Error('Not authorized to upload circulars');
  }

  if (!title || !fileUrl) {
    res.status(400);
    throw new Error('Please provide title and file URL');
  }

  try {
    // In a real app, we'd create a new circular document in the database
    
    // Mock response for now
    res.status(201).json({
      success: true,
      message: 'Circular uploaded successfully',
      circular: {
        id: Math.random().toString(36).substring(2, 15),
        title,
        description: description || '',
        fileUrl,
        targetRoles: targetRoles || [],
        targetDepartments: targetDepartments || [],
        uploadedBy: {
          id: user._id,
          name: user.name,
          role: user.role
        },
        uploadedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error uploading circular: ${error.message}`);
  }
});

/**
 * @desc    Get circulars for user
 * @route   GET /api/v1/circulars
 * @access  Private
 */
const getCirculars = asyncHandler(async (req, res) => {
  const user = req.user;

  try {
    // In a real app, we'd query circulars based on user's role and department
    
    // Mock data for now
    const circulars = [
      {
        id: '1',
        title: 'Academic Calendar 2023-2024',
        description: 'Official academic calendar for the next academic year',
        fileUrl: 'https://example.com/calendar.pdf',
        uploadedBy: {
          id: 'principal1',
          name: 'Dr. Principal',
          role: 'principal'
        },
        uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: 'Faculty Meeting Minutes',
        description: 'Minutes from the faculty meeting held on September 10, 2023',
        fileUrl: 'https://example.com/meeting-minutes.pdf',
        uploadedBy: {
          id: 'hod1',
          name: 'Dr. HOD',
          role: 'hod'
        },
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    res.status(200).json({
      success: true,
      circulars
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error retrieving circulars: ${error.message}`);
  }
});

module.exports = {
  createAnnouncement,
  getAnnouncements,
  uploadCircular,
  getCirculars
};
