const express = require('express');
const { updateUserCreditInfo } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Update user credit information
router.put('/credit-info', updateUserCreditInfo);

module.exports = router;