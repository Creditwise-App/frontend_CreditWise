const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import routes
const authRoutes = require('../routes/auth');
const lessonRoutes = require('../routes/lessons');
const quizRoutes = require('../routes/quizzes');
const appointmentRoutes = require('../routes/appointments');
const tipRoutes = require('../routes/tips');
const adminRoutes = require('../routes/admin');
const userRoutes = require('../routes/users');

const app = express();

// Configure CORS for Vercel
const corsOptions = {
  origin: true, // Allow all origins in production
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB with improved error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creditwise';
mongoose.connect(MONGODB_URI, {
  // Remove deprecated options for newer MongoDB versions
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
  console.error('MongoDB connection error:', error);
  // Note: In a serverless environment, we can't exit the process
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CreditWise API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// For Vercel, we need to export the app directly for serverless functions
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // Wrap the Express app with serverless-http for other environments
  const handler = serverless(app);
  module.exports.handler = async (event, context) => {
    return handler(event, context);
  };
}