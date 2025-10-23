const express = require('express');
const { 
  getDashboardStats,
  getLessonFeedbackDetails,
  getAllUsers,
  getAllAppointments,
  createLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin authorization
router.use(authenticate, authorizeAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/lesson-feedback-details', getLessonFeedbackDetails);
router.get('/users', getAllUsers);
router.get('/appointments', getAllAppointments);
router.post('/lessons', createLesson);
router.put('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);

module.exports = router;