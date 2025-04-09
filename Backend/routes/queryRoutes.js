const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { submitQuery, getMyQueries, getStudentQueries } = require('../controllers/queryController');

// Protect all routes
router.use(protect);

// Submit query (student only)
router.post('/', submitQuery);

// Get my queries (student only)
router.get('/my-queries', getMyQueries);

// Get all student queries (faculty/hod/principal only)
router.get('/', getStudentQueries);

module.exports = router;
