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
      // Get class groups where student is enrolled
      classGroups = await ClassGroup.find({
        students: user._id
      }).select('name year batch department').populate('programCoordinator tutor', 'name email');

      // Get course groups where student is enrolled
      courseGroups = await CourseGroup.find({
        students: user._id
      }).select('courseCode courseName semester').populate('faculty', 'name email');

      // Add role information to each response
      classGroups = classGroups.map(group => ({
        ...group.toObject(),
        userRole: 'student'
      }));

      courseGroups = courseGroups.map(course => ({
        ...course.toObject(),
        userRole: 'student'
      }));
    } else if (user.role === 'faculty') {
      // Get class groups where faculty is tutor or coordinator
      classGroups = await ClassGroup.find({
        $or: [
          { tutor: user._id },
          { programCoordinator: user._id }
        ]
      }).select('name year batch department').populate('programCoordinator tutor', 'name email');

      // Mark the user's role in each class group
      classGroups = classGroups.map(group => {
        const groupObj = group.toObject();
        let userRole = 'unknown';
        
        if (group.programCoordinator && group.programCoordinator._id.equals(user._id)) {
          userRole = 'coordinator';
        } else if (group.tutor && group.tutor._id.equals(user._id)) {
          userRole = 'tutor';
        }
        
        return {
          ...groupObj,
          userRole
        };
      });

      // Get course groups where faculty is assigned
      courseGroups = await CourseGroup.find({
        faculty: user._id
      }).select('courseCode courseName semester classGroup').populate('classGroup', 'name year batch department');

      courseGroups = courseGroups.map(course => ({
        ...course.toObject(),
        userRole: 'faculty'
      }));
    }

    // Check if any classes or courses were found
    if (classGroups.length === 0 && courseGroups.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No classes or courses found for this user'
      });
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

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getMe,
  getUserById,
  updateUser,
  getMyClasses
};
