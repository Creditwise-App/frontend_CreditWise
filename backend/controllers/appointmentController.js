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
    // Log the incoming request for debugging
    console.log('Incoming appointment request:', req.body);
    console.log('User from token:', req.user);
    
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
    
    console.log('Creating appointment with data:', {
      userId: req.user._id,
      userName: req.user.name,
      preferredDate,
      answers: answers || {}
    });
    
    // Save the appointment
    const savedAppointment = await appointment.save();
    console.log('Appointment saved successfully:', savedAppointment);
    
    // Populate the user details before sending response
    await savedAppointment.populate('userId', 'name email');
    
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    // More detailed error logging
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.errors);
    }
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus
};