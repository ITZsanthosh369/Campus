const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Protect routes - middleware to verify JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (remove "Bearer" prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found with this token');
      }

      next();
    } catch (error) {
      // Only log errors in non-test environments
      if (process.env.NODE_ENV !== 'test') {
        console.error(error);
      }
      
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

// Authorize by role - middleware to check user role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('User not authenticated');
    }
    
    // Special case for programCoordinator - faculty users can be program coordinators
    if (roles.includes('programCoordinator') && req.user.role === 'faculty') {
      // We'll check the actual class group ownership in the controller
      return next();
    }
    
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role (${req.user.role}) is not allowed to access this resource`
      );
    }
    
    next();
  };
};

module.exports = { protect, authorizeRoles };
