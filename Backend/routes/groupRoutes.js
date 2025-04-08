const express = require('express');
const router = express.Router();
const { assignCourseToClassGroup } = require('../controllers/groupController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Assign a course to a class group
router.post(
  '/assign-course',
  protect,
  authorizeRoles('programCoordinator', 'admin'),
  assignCourseToClassGroup
);

module.exports = router;
