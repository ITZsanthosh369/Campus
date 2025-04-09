const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Get all announcements
router.get('/', announcementController.getAnnouncements);

// Get circulars
router.get('/circulars', announcementController.getCirculars);

// Create a new announcement - restricted to faculty and administrative roles
router.post('/', authorizeRoles('faculty', 'hod', 'principal', 'admin'), announcementController.createAnnouncement);

// Only add these routes if the controller methods exist
// From the error, it seems these methods are not implemented yet
// Comment them out for now
/* 
// Update an announcement - restricted to the creator or administrative roles
router.put('/:id', authorizeRoles('faculty', 'hod', 'principal', 'admin'), announcementController.updateAnnouncement);

// Delete an announcement - restricted to the creator or administrative roles
router.delete('/:id', authorizeRoles('faculty', 'hod', 'principal', 'admin'), announcementController.deleteAnnouncement);
*/

module.exports = router;
