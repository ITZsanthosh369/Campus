const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Send a message (all authenticated users except admin can send)
router.post('/send', protect, sendMessage);

// Get messages from a group (all authenticated users except admin can read)
router.get('/', protect, getMessages);

module.exports = router;
