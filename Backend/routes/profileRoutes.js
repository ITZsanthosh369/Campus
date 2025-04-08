const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

// Get user profile
router.get('/', protect, getUserProfile);

// Update user profile
router.put('/', protect, updateUserProfile);

module.exports = router;
