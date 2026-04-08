const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables FIRST
dotenv.config();

// Route imports
const orderRoutes = require('./routes/orderRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dynamicRoutes = require('./routes/dynamicRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Allow all origins (fix for Vercel)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/data', dynamicRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running correctly.' });
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("WARNING: MONGODB_URI is not defined. Database connections will fail.");
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend Server is running on port ${PORT}`);
});
