const express = require('express');
const router = express.Router();
const { 
  markAttendance, 
  getAttendance 
} = require('../controllers/attendanceController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Mark attendance route (faculty only)
router.post('/', protect, authorizeRoles('faculty'), markAttendance);

// Get attendance route (faculty only)
router.get('/', protect, authorizeRoles('faculty'), getAttendance);

module.exports = router;
