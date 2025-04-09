const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { submitAssignment, getMySubmissions } = require('../controllers/submissionController');

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/', submitAssignment);
router.get('/my-submissions', getMySubmissions);

module.exports = router;
