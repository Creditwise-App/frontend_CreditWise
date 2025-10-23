const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/creditwise', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createTestAppointment = async () => {
  try {
    // First, find a user to associate with the appointment
    const user = await User.findOne();
    if (!user) {
      console.log('No users found in database. Please seed the database first.');
      process.exit(1);
    }
    
    console.log('Creating appointment for user:', user.name);
    
    // Create a test appointment
    const appointment = new Appointment({
      userId: user._id,
      userName: user.name,
      preferredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      answers: {
        test: 'This is a test appointment',
        purpose: 'Debugging appointment creation'
      }
    });
    
    const savedAppointment = await appointment.save();
    console.log('Appointment created successfully:');
    console.log(JSON.stringify(savedAppointment, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating appointment:', error);
    process.exit(1);
  }
};

createTestAppointment();