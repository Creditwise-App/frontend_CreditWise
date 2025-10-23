const CreditTip = require('../models/CreditTip');

const getAllTips = async (req, res) => {
  try {
    const tips = await CreditTip.find();
    res.json(tips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTipById = async (req, res) => {
  try {
    const tip = await CreditTip.findById(req.params.id);
    if (!tip) {
      return res.status(404).json({ message: 'Tip not found' });
    }
    res.json(tip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTip = async (req, res) => {
  try {
    const { title, description } = req.body;
    const tip = new CreditTip({ title, description });
    await tip.save();
    res.status(201).json(tip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTip = async (req, res) => {
  try {
    const { title, description } = req.body;
    const tip = await CreditTip.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    
    if (!tip) {
      return res.status(404).json({ message: 'Tip not found' });
    }
    
    res.json(tip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTip = async (req, res) => {
  try {
    const tip = await CreditTip.findByIdAndDelete(req.params.id);
    
    if (!tip) {
      return res.status(404).json({ message: 'Tip not found' });
    }
    
    res.json({ message: 'Tip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTips,
  getTipById,
  createTip,
  updateTip,
  deleteTip
};