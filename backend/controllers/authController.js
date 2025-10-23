const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user with null credit values
    const user = new User({ email, password, name });
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    // Only include credit fields in response if they have values
    const response = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      token
    };
    
    // Add credit fields only if they're not null
    if (user.currentCreditScore !== null) {
      response.currentCreditScore = user.currentCreditScore;
    }
    if (user.targetCreditScore !== null) {
      response.targetCreditScore = user.targetCreditScore;
    }
    if (user.extraMonthlyPayment !== null) {
      response.extraMonthlyPayment = user.extraMonthlyPayment;
    }
    
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Log user data for debugging
    console.log('User data from database:', {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      currentCreditScore: user.currentCreditScore,
      targetCreditScore: user.targetCreditScore,
      extraMonthlyPayment: user.extraMonthlyPayment
    });
    
    // Only include credit fields in response if they have values
    const response = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      token
    };
    
    // Always include credit fields in response, even if null
    response.currentCreditScore = user.currentCreditScore;
    response.targetCreditScore = user.targetCreditScore;
    response.extraMonthlyPayment = user.extraMonthlyPayment;
    
    console.log('Login response:', response);
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login
};