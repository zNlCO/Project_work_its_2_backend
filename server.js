const app = require('./app');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Get port from environment variable or use default
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
}); 