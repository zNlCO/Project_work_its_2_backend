const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');
const {
  getAllInsurances,
  getInsurance,
  createInsurance,
  updateInsurance,
  deleteInsurance
} = require('../controllers/insurance.controller');

// Validation for insurance creation and update
const insuranceValidation = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
];

// Public routes
router.get('/', getAllInsurances);
router.get('/:id', getInsurance);

// Protected routes (operator only)
router.use(protect);
router.use(restrictTo('operator'));

router.post('/', insuranceValidation, validateRequest, createInsurance);
router.put('/:id', insuranceValidation, validateRequest, updateInsurance);
router.delete('/:id', deleteInsurance);

module.exports = router; 