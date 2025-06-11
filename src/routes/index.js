const express = require('express');
const router = express.Router();

console.log('Initializing main router...');

// Import routes
const authRoutes = require('./auth.routes');
const storeRoutes = require('./store.routes');
const accessoryRoutes = require('./accessory.routes');
const insuranceRoutes = require('./insurance.routes');

// Debug log
console.log('Routes loaded:', {
  auth: !!authRoutes,
  store: !!storeRoutes,
  accessory: !!accessoryRoutes,
  insurance: !!insuranceRoutes
});

// Debug middleware to log all requests to this router
router.use((req, res, next) => {
  console.log('Main router request:', req.method, req.baseUrl + req.url);
  next();
});

// Mount routes
console.log('Mounting /auth routes...');
router.use('/auth', authRoutes);

console.log('Mounting /stores routes...');
router.use('/stores', storeRoutes);

console.log('Mounting /accessories routes...');
router.use('/accessories', accessoryRoutes);

console.log('Mounting /insurances routes...');
router.use('/insurances', insuranceRoutes);

// Debug: Print all registered routes in this router
console.log('Main router stack:', 
  router.stack.map(layer => ({
    path: layer.regexp.toString(),
    methods: layer.route ? Object.keys(layer.route.methods) : 'middleware'
  }))
);

module.exports = router; 