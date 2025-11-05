const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");

const app = express();
connectDB();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

const path = require('path');
require('dotenv').config();


// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Simple session setup (without passport for now)
app.use(require('express-session')({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false
}));

// Import routes with error handling
let authRoutes, userRoutes, rideRoutes, bookingRoutes;

try {
  authRoutes = require('./routes/auth');
  userRoutes = require('./routes/users');
  rideRoutes = require('./routes/rides');
  bookingRoutes = require('./routes/bookings');
  console.log('✅ All route files loaded successfully');
} catch (error) {
  console.log('❌ Error loading route files:', error.message);
  process.exit(1);
}

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚗 Student Ride Share API is running!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    endpoints: [
      '/api/auth',
      '/api/users',
      '/api/rides', 
      '/api/bookings'
    ]
  });
});

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    availableRoutes: [
      'GET /',
      'GET /api/auth',
      'GET /api/users',
      'GET /api/rides',
      'GET /api/bookings'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('✨ ======================================== ✨');
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🛣️  API Test: http://localhost:${PORT}/api/auth`);
  console.log('✨ ======================================== ✨');
});