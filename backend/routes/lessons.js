const express = require('express');
const { getAllLessons, getLessonById, likeLesson, dislikeLesson, getUserLessonFeedback } = require('../controllers/lessonController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getAllLessons);
router.get('/:id', authenticate, getLessonById);
router.post('/:id/like', authenticate, likeLesson);
router.post('/:id/dislike', authenticate, dislikeLesson);
router.get('/:id/feedback', authenticate, getUserLessonFeedback);

module.exports = router;