const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const User = require('./models/User'); // Import User model

mongoose.connect('mongodb://localhost:27017/creditwise', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkAppointments = async () => {
  try {
    const appointments = await Appointment.find(); // Don't populate for now to avoid the error
    console.log('Current appointments in database:');
    console.log(JSON.stringify(appointments, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error checking appointments:', error);
    process.exit(1);
  }
};

checkAppointments();