const express = require('express');
const router = express.Router();
const { 
  gradeSubmissions, 
  getSubmissions 
} = require('../controllers/gradingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Grade submissions route (faculty only)
router.post('/grade', protect, authorizeRoles('faculty'), gradeSubmissions);

// Get submissions route (faculty only)
router.get('/', protect, authorizeRoles('faculty'), getSubmissions);

module.exports = router;
