const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('../../backend/routes/auth');
const lessonRoutes = require('../../backend/routes/lessons');
const quizRoutes = require('../../backend/routes/quizzes');
const appointmentRoutes = require('../../backend/routes/appointments');
const tipRoutes = require('../../backend/routes/tips');
const adminRoutes = require('../../backend/routes/admin');
const userRoutes = require('../../backend/routes/users');

const app = express();

// Configure CORS for Netlify Functions
const corsOptions = {
  origin: true, // Allow all origins in production
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creditwise')
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

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

// Wrap the Express app with serverless-http
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  return handler(event, context);
};