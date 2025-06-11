const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { 
  register, 
  confirmEmail, 
  login, 
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');

// Validation middleware
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  body('role')
    .optional()
    .isIn(['user', 'operator'])
    .withMessage('Role must be either user or operator')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
];

const changePasswordValidation = [
  body('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
];

// Public routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/confirm-email/:userId', confirmEmail);
router.post('/login', loginValidation, validateRequest, login);

// Protected routes
router.use(protect); // Tutti i route dopo questa riga richiedono autenticazione
router.get('/me', getMe);
router.put('/update-profile', updateProfileValidation, validateRequest, updateProfile);
router.put('/change-password', changePasswordValidation, validateRequest, changePassword);

module.exports = router; 