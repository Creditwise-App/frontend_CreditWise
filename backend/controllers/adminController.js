const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Appointment = require('../models/Appointment');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    
    // Calculate total likes and dislikes across all lessons
    const lessons = await Lesson.find({}, 'likes dislikes');
    const totalLikes = lessons.reduce((sum, lesson) => sum + (lesson.likes || 0), 0);
    const totalDislikes = lessons.reduce((sum, lesson) => sum + (lesson.dislikes || 0), 0);
    
    // Get recent appointments
    const recentAppointments = await Appointment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      stats: {
        totalUsers,
        totalLessons,
        totalQuizzes,
        totalAppointments,
        totalLikes,
        totalDislikes
      },
      recentAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessonFeedbackDetails = async (req, res) => {
  try {
    // Get all lessons with their title, likes, and dislikes
    const lessons = await Lesson.find({}, 'title likes dislikes');
    
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch appointments' });
  }
};

const createLesson = async (req, res) => {
  try {
    const { title, content } = req.body;
    const lesson = new Lesson({ title, content });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { title, content } = req.body;
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getLessonFeedbackDetails,
  getAllUsers,
  getAllAppointments,
  createLesson,
  updateLesson,
  deleteLesson
};