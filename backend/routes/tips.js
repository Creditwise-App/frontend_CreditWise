const express = require('express');
const { 
  getAllTips, 
  getTipById,
  createTip,
  updateTip,
  deleteTip
} = require('../controllers/creditTipController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getAllTips);
router.get('/:id', authenticate, getTipById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, createTip);
router.put('/:id', authenticate, authorizeAdmin, updateTip);
router.delete('/:id', authenticate, authorizeAdmin, deleteTip);

module.exports = router;