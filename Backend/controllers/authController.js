const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const keys = require('../config/keys');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, classGroup, batch, year } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      classGroup,
      batch,
      year,
    });
    
    if (user) {
      // Return user data with token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        classGroup: user.classGroup,
        batch: user.batch,
        year: user.year,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    
    // Verify user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        classGroup: user.classGroup,
        batch: user.batch,
        year: user.year,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw new Error(error.message);
  }
});

module.exports = { registerUser, loginUser };
