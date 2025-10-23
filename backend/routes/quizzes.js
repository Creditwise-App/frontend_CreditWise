const express = require('express');
const { getAllQuizzes, getQuizById } = require('../controllers/quizController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getAllQuizzes);
router.get('/:id', authenticate, getQuizById);

module.exports = router;