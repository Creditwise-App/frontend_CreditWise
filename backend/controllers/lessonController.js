const Lesson = require('../models/Lesson');
const LessonFeedback = require('../models/LessonFeedback');

const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likeLesson = async (req, res) => {
  try {
    const userId = req.user._id;
    const lessonId = req.params.id;
    
    // Check if user already has feedback for this lesson
    const existingFeedback = await LessonFeedback.findOne({ userId, lessonId });
    
    // Get the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    if (existingFeedback) {
      if (existingFeedback.feedbackType === 'like') {
        // User already liked, so remove the like
        await LessonFeedback.deleteOne({ userId, lessonId });
        lesson.likes = Math.max(0, (lesson.likes || 0) - 1);
      } else {
        // User disliked, change to like
        existingFeedback.feedbackType = 'like';
        await existingFeedback.save();
        lesson.likes = (lesson.likes || 0) + 1;
        lesson.dislikes = Math.max(0, (lesson.dislikes || 0) - 1);
      }
    } else {
      // User hasn't given feedback, add a like
      await LessonFeedback.create({ userId, lessonId, feedbackType: 'like' });
      lesson.likes = (lesson.likes || 0) + 1;
    }
    
    await lesson.save();
    
    res.json({ 
      likes: lesson.likes, 
      dislikes: lesson.dislikes,
      userFeedback: 'like'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const dislikeLesson = async (req, res) => {
  try {
    const userId = req.user._id;
    const lessonId = req.params.id;
    
    // Check if user already has feedback for this lesson
    const existingFeedback = await LessonFeedback.findOne({ userId, lessonId });
    
    // Get the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    if (existingFeedback) {
      if (existingFeedback.feedbackType === 'dislike') {
        // User already disliked, so remove the dislike
        await LessonFeedback.deleteOne({ userId, lessonId });
        lesson.dislikes = Math.max(0, (lesson.dislikes || 0) - 1);
      } else {
        // User liked, change to dislike
        existingFeedback.feedbackType = 'dislike';
        await existingFeedback.save();
        lesson.dislikes = (lesson.dislikes || 0) + 1;
        lesson.likes = Math.max(0, (lesson.likes || 0) - 1);
      }
    } else {
      // User hasn't given feedback, add a dislike
      await LessonFeedback.create({ userId, lessonId, feedbackType: 'dislike' });
      lesson.dislikes = (lesson.dislikes || 0) + 1;
    }
    
    await lesson.save();
    
    res.json({ 
      likes: lesson.likes, 
      dislikes: lesson.dislikes,
      userFeedback: 'dislike'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's feedback for a specific lesson
const getUserLessonFeedback = async (req, res) => {
  try {
    const userId = req.user._id;
    const lessonId = req.params.id;
    
    const feedback = await LessonFeedback.findOne({ userId, lessonId });
    
    res.json({ 
      userFeedback: feedback ? feedback.feedbackType : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLessons,
  getLessonById,
  likeLesson,
  dislikeLesson,
  getUserLessonFeedback
};