const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Remove quizId field if it exists in existing documents
lessonSchema.pre('save', function(next) {
  if (this.quizId) {
    this.quizId = undefined;
  }
  next();
});

module.exports = mongoose.model('Lesson', lessonSchema);