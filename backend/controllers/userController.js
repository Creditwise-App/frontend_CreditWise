const User = require('../models/User');

const updateUserCreditInfo = async (req, res) => {
  try {
    const { currentCreditScore, targetCreditScore, extraMonthlyPayment } = req.body;
    
    // Log the incoming request for debugging
    console.log('Updating user credit info request body:', req.body);
    
    // Validate that we have a user
    if (!req.user) {
      console.log('User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    console.log('Authenticated user:', req.user);
    
    // Prepare update data - only include fields that are provided
    const updateData = {};
    if (currentCreditScore !== undefined) {
      // If the value is null or a valid credit score, use it; otherwise set to null
      updateData.currentCreditScore = (currentCreditScore === null || (currentCreditScore >= 300 && currentCreditScore <= 850)) 
        ? currentCreditScore 
        : null;
    }
    if (targetCreditScore !== undefined) {
      // If the value is null or a valid credit score, use it; otherwise set to null
      updateData.targetCreditScore = (targetCreditScore === null || (targetCreditScore >= 300 && targetCreditScore <= 850)) 
        ? targetCreditScore 
        : null;
    }
    if (extraMonthlyPayment !== undefined) {
      // If the value is null or a valid payment amount, use it; otherwise set to null
      updateData.extraMonthlyPayment = (extraMonthlyPayment === null || extraMonthlyPayment >= 0) 
        ? extraMonthlyPayment 
        : null;
    }
    
    console.log('Update data to be applied:', updateData);
    console.log('User ID to update:', req.user._id);
    
    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, select: '-password' } // Exclude password from response
    );
    
    console.log('Find and update result:', updatedUser);
    
    if (!updatedUser) {
      console.log('User not found with ID:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User updated successfully:', updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user credit info:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateUserCreditInfo
};