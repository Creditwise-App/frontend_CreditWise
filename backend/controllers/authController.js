const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user with null credit values
    const user = new User({ email, password, name });
    console.log('Creating new user:', { email, name });
    await user.save();
    console.log('User created successfully:', user._id);
    
    // Generate token
    const token = generateToken(user._id);
    console.log('Token generated for user:', user._id);
    
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
    
    console.log('Sending registration response:', response);
    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

const login = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    console.log('Token generated for user:', user._id);
    
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
    
    console.log('Sending login response:', response);
    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
};

module.exports = {
  register,
  login
};