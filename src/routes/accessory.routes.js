const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');
const {
  getAllAccessories,
  getAccessory,
  createAccessory,
  updateAccessory,
  deleteAccessory
} = require('../controllers/accessory.controller');

// Validation for accessory creation and update
const accessoryValidation = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
];

// Public routes
router.get('/', getAllAccessories);
router.get('/:id', getAccessory);

// Protected routes (operator only)
router.use(protect);
router.use(restrictTo('operator'));

router.post('/', accessoryValidation, validateRequest, createAccessory);
router.put('/:id', accessoryValidation, validateRequest, updateAccessory);
router.delete('/:id', deleteAccessory);

module.exports = router; 