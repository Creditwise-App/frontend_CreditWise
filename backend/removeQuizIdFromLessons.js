const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import the Lesson model
const Lesson = require('./models/Lesson');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creditwise', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const removeQuizIdFromLessons = async () => {
  try {
    console.log('Removing quizId field from all lessons...');
    
    // Remove quizId field from all lessons
    const result = await Lesson.updateMany(
      { quizId: { $exists: true } },
      { $unset: { quizId: "" } }
    );
    
    console.log(`Successfully removed quizId from ${result.modifiedCount} lessons`);
    console.log('Migration completed!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

removeQuizIdFromLessons();