const express = require('express');
const { 
  getAllAppointments, 
  getAppointmentById, 
  createAppointment, 
  updateAppointmentStatus 
} = require('../controllers/appointmentController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, authorizeAdmin, getAllAppointments);
router.get('/:id', authenticate, authorizeAdmin, getAppointmentById);
router.post('/', authenticate, createAppointment);
router.put('/:id/status', authenticate, authorizeAdmin, updateAppointmentStatus);

module.exports = router;