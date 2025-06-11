const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Debug log per verificare le variabili d'ambiente (rimuovere in produzione)
console.log('Environment variables loaded:', {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set',
  emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
  emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set',
  frontendUrl: process.env.FRONTEND_URL
});

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Bike Rental API' });
});

// Auth routes
app.use('/api/auth', require('./src/routes/auth.routes'));

// Bike types routes
app.use('/api/bike-types', require('./src/routes/bikeType.routes'));

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Something went wrong! Please try again later.'
  });
});

module.exports = app; 