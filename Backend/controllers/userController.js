const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const ClassGroup = require('../models/classGroupModel');
const CourseGroup = require('../models/courseGroupModel');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      year: user.year,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, year } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    department,
    year,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      year: user.year,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      year: user.year,
      profileImage: user.profileImage,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.department = req.body.department || user.department;
    user.year = req.body.year || user.year;
    user.profileImage = req.body.profileImage || user.profileImage;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      year: updatedUser.year,
      profileImage: updatedUser.profileImage,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

/**
 * @desc    Get current user profile (using req.user from auth middleware)
 * @route   GET /api/v1/users/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // Since user is already loaded in req.user from protect middleware
  res.json(req.user);
});

/**
 * @desc    Get user by ID
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin/HOD
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update user role and details (admin only)
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.department = req.body.department || user.department;
    
    // Only update these fields if user is a student and they're provided
    if (user.role === 'student') {
      user.classGroup = req.body.classGroup || user.classGroup;
      user.batch = req.body.batch || user.batch;
      user.year = req.body.year || user.year;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      classGroup: updatedUser.classGroup,
      batch: updatedUser.batch,
      year: updatedUser.year,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Get classes and courses associated with the authenticated user
 * @route   GET /api/v1/users/my-classes
 * @access  Private
 */
const getMyClasses = asyncHandler(async (req, res) => {
  const user = req.user;
  let classGroups = [];
  let courseGroups = [];

  try {
    if (user.role === 'student') {
      // TODO: In production, fetch the actual class groups from database
      // For now, return mock data to unblock frontend testing
      
      // Mock class groups data
      classGroups = [
        {
          _id: '60d5ec9d8e8a8d2b9c9a1234',
          name: user.classGroup || 'CSE-2023',
          year: parseInt(user.year) || 2,
          batch: user.batch || 'A',
          department: user.department || 'CSE',
          tutor: {
            _id: '60d5ec9d8e8a8d2b9c9a5678',
            name: 'Dr. Jane Smith',
            email: 'jsmith@campusconnect.com'
          },
          programCoordinator: {
            _id: '60d5ec9d8e8a8d2b9c9a9876',
            name: 'Dr. Robert Johnson',
            email: 'rjohnson@campusconnect.com'
          },
          userRole: 'student'
        }
      ];

      // Mock course groups data
      courseGroups = [
        {
          _id: '60d5ec9d8e8a8d2b9c9a2345',
          courseCode: 'CS101',
          courseName: 'Introduction to Programming',
          semester: 1,
          faculty: {
            _id: '60d5ec9d8e8a8d2b9c9a7890',
            name: 'Prof. Alan Turing',
            email: 'faculty@campusconnect.com'
          },
          userRole: 'student'
        },
        {
          _id: '60d5ec9d8e8a8d2b9c9a3456',
          courseCode: 'CS201',
          courseName: 'Data Structures',
          semester: 3,
          faculty: {
            _id: '60d5ec9d8e8a8d2b9c9a8901',
            name: 'Dr. Ada Lovelace',
            email: 'alovelace@campusconnect.com'
          },
          userRole: 'student'
        }
      ];
    } else if (user.role === 'faculty') {
      // TODO: In production, fetch the actual class groups and courses assigned to faculty
      // Mock data for faculty
      classGroups = [
        {
          _id: '60d5ec9d8e8a8d2b9c9a4567',
          name: 'CSE-2022',
          year: 3,
          batch: 'B',
          department: 'CSE',
          userRole: 'tutor',
          studentCount: 30
        }
      ];
      
      courseGroups = [
        {
          _id: '60d5ec9d8e8a8d2b9c9a5678',
          courseCode: 'CS301',
          courseName: 'Database Systems',
          semester: 5,
          classGroup: {
            name: 'CSE-2022',
            year: 3,
            batch: 'B',
            department: 'CSE'
          },
          userRole: 'faculty',
          studentCount: 28
        }
      ];
    }

    res.status(200).json({
      success: true,
      classGroups,
      courseGroups
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error retrieving classes: ${error.message}`);
  }
});

/**
 * @desc    Get recent activities for faculty
 * @route   GET /api/v1/users/activities
 * @access  Private/Faculty
 */
const getFacultyActivities = asyncHandler(async (req, res) => {
  const user = req.user;

  // Verify user is faculty
  if (user.role !== 'faculty') {
    res.status(403);
    throw new Error('Not authorized, faculty only');
  }

  try {
    // Mock data for now - in a real app, this would query from activity collection
    const activities = [
      {
        type: 'assignment',
        title: 'Midterm Assignment',
        courseCode: 'CS101',
        courseName: 'Introduction to Programming',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'posted'
      },
      {
        type: 'attendance',
        courseCode: 'CS201',
        courseName: 'Data Structures',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        studentsPresent: 42,
        studentsAbsent: 3
      },
      {
        type: 'grading',
        title: 'Lab Exercise 4',
        courseCode: 'CS101',
        courseName: 'Introduction to Programming',
        date: new Date(),
        submissionsGraded: 35
      }
    ];

    res.status(200).json({
      success: true,
      activities: activities
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Error retrieving activities: ${error.message}`);
  }
});

/**
 * @desc    Get student queries for faculty
 * @route   GET /api/v1/users/queries
 * @access  Private/Faculty
 */
const getStudentQueries = asyncHandler(async (req, res) => {
  const user = req.user;
  const { courseId } = req.query;

  // Verify user is faculty
  if (user.role !== 'faculty') {
    res.status(403);
    throw new Error('Not authorized, faculty only');
  }

  try {
    // Mock data for now - in a real app, this would query from queries collection
    const queries = [
      {
        id: '1',
        studentName: 'John Doe',
        studentId: '60a12e5c9b48e32b4c9a1234',
        courseCode: 'CS101',
        courseName: 'Introduction to Programming',
        subject: 'Assignment Clarification',
        message: 'I need clarification on question 3 of the midterm assignment.',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        id: '2',
        studentName: 'Jane Smith',
        studentId: '60a12e5c9b48e32b4c9a5678',
        courseCode: 'CS201',
        courseName: 'Data Structures',
        subject: 'Extension Request',
        message: 'Could I have a two-day extension for submitting the lab report?',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'pending'
      }
    ];

    // If courseId is provided, filter queries by course
    const filteredQueries = courseId ? 
      queries.filter(query => query.courseId === courseId) : 
      queries;

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
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getMe,
  getUserById,
  updateUser,
  getMyClasses,
  getFacultyActivities,
  getStudentQueries
};
