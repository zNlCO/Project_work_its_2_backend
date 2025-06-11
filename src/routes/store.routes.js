const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');
const {
  getAllStores,
  getStore,
  createStore,
  updateStore,
  deleteStore
} = require('../controllers/store.controller');

// Debug log
console.log('Store routes initialized');
console.log('Store controller methods:', {
  getAllStores: !!getAllStores,
  getStore: !!getStore,
  createStore: !!createStore,
  updateStore: !!updateStore,
  deleteStore: !!deleteStore
});

// Logging middleware for store routes
router.use((req, res, next) => {
  console.log('Store route accessed:', req.method, req.url);
  next();
});

// Validation for store creation and update
const storeValidation = [
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
];

// Public routes
router.get('/', (req, res, next) => {
  console.log('GET /stores route hit');
  next();
}, getAllStores);

router.get('/:id', getStore);

// Protected routes (operator only)
router.use(protect);
router.use(restrictTo('operator'));

router.post('/', storeValidation, validateRequest, createStore);
router.put('/:id', storeValidation, validateRequest, updateStore);
router.delete('/:id', deleteStore);

module.exports = router; 