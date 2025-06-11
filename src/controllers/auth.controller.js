const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendConfirmationEmail } = require('../services/email.service');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      isOperator: role === 'operator'
    });

    // Send confirmation email
    await sendConfirmationEmail(email, name, user._id);

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to confirm your account.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailConfirmed: user.isEmailConfirmed,
        isOperator: user.isOperator,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration. Please try again.'
    });
  }
};

// Confirm email
const confirmEmail = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailConfirmed) {
      return res.status(400).json({
        success: false,
        message: 'Email is already confirmed'
      });
    }

    // Update user
    user.isEmailConfirmed = true;
    await user.save();

    res.json({
      success: true,
      message: 'Email confirmed successfully'
    });
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during email confirmation. Please try again.'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is confirmed
    if (!user.isEmailConfirmed) {
      return res.status(401).json({
        success: false,
        message: 'Please confirm your email address before logging in'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailConfirmed: user.isEmailConfirmed,
        isOperator: user.isOperator,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login. Please try again.'
    });
  }
};

// Get current logged in user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailConfirmed: user.isEmailConfirmed,
        isOperator: user.isOperator,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user information'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);
    if (name) user.name = name;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailConfirmed: user.isEmailConfirmed,
        isOperator: user.isOperator,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
};

module.exports = {
  register,
  confirmEmail,
  login,
  getMe,
  updateProfile,
  changePassword
}; 