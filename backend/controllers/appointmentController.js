const Appointment = require('../models/Appointment');
const User = require('../models/User');

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('userId', 'name email');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('userId', 'name email');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { preferredDate, answers } = req.body;
    
    // Validate that we have a user
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Check if user already has a pending appointment
    const existingPendingAppointment = await Appointment.findOne({
      userId: req.user._id,
      status: 'pending'
    });
    
    if (existingPendingAppointment) {
      return res.status(400).json({ 
        message: 'You already have a pending appointment. Please wait for admin review before booking another one.' 
      });
    }
    
    const appointment = new Appointment({
      userId: req.user._id, // Always use the authenticated user's ID
      userName: req.user.name, // Always use the authenticated user's name
      preferredDate,
      answers: answers || {}
    });
    
    // Save the appointment
    const savedAppointment = await appointment.save();
    
    // Populate the user details before sending response
    await savedAppointment.populate('userId', 'name email');
    
    res.status(201).json(savedAppointment);
  } catch (error) {
    // More detailed error logging
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid appointment data provided' });
    }
    res.status(500).json({ message: 'Failed to create appointment' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment status' });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus
};