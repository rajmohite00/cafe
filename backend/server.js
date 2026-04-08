const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Route imports
const orderRoutes = require('./routes/orderRoutes');
const activityRoutes = require('./routes/activityRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/activities', activityRoutes);
const dynamicRoutes = require('./routes/dynamicRoutes');
app.use('/api/data', dynamicRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running correctly.' });
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("WARNING: MONGODB_URI is not defined in .env file. The server will start but database connections will fail until it is added.");
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend Server is running on http://localhost:${PORT}`);
});
