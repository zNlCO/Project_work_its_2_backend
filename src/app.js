const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug route registration
console.log('Registering routes...');

// Basic test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Mount API routes
console.log('Mounting /api routes...');
app.use('/api', routes);

// Print registered routes
console.log('Registered routes:');
app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
        console.log(r.route.stack[0].method.toUpperCase(), r.route.path);
    } else if(r.name === 'router'){
        console.log('Router middleware:', r.regexp);
    }
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

module.exports = app; 