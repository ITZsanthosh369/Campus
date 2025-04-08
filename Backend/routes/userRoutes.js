const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getMe,
  getUserById,
  updateUser
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.route('/').post(registerUser);
router.post('/login', authUser);

// Protected routes
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Current user route
router.get('/me', protect, getMe);

// Admin routes
router.route('/')
  .get(protect, authorizeRoles('admin', 'hod', 'principal'), getUsers);

// User by ID routes
router
  .route('/:id')
  .get(protect, authorizeRoles('admin', 'hod', 'principal'), getUserById)
  .put(protect, authorizeRoles('admin', 'principal'), updateUser);

module.exports = router;
