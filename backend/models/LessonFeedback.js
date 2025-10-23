const mongoose = require('mongoose');

const lessonFeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  feedbackType: {
    type: String,
    enum: ['like', 'dislike'],
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can only have one feedback per lesson
lessonFeedbackSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('LessonFeedback', lessonFeedbackSchema);