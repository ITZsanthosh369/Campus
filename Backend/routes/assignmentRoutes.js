const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Create assignment route (faculty only)
router.post('/', authorizeRoles('faculty'), assignmentController.createAssignment);

// Get all assignments (for students: their assignments, for faculty: assignments they created)
router.get('/', assignmentController.getAssignments);

module.exports = router;
