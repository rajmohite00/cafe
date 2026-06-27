const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables FIRST
dotenv.config();

const app = express();

// ── MongoDB connection with Vercel serverless caching ──────────────────────
// On Vercel, each function invocation may reuse the same Node process.
// We cache the connection so we don't reconnect on every request.
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set — DB features will fail');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    isConnected = true;
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    isConnected = false;
  }
};

// Connect immediately on startup
connectDB();

// ── CORS ───────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const envOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : [];
    const hardcoded = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://rajs-cafe.vercel.app',
      'https://rajs-cafe-admin.vercel.app',
    ];
    if (
      hardcoded.includes(origin) ||
      envOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.startsWith('http://localhost:')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight for all routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Ensure DB is connected before every request
app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

// ── Routes ─────────────────────────────────────────────────────────────────
const orderRoutes    = require('./routes/orderRoutes');
const activityRoutes = require('./routes/activityRoutes');
const authRoutes     = require('./routes/authRoutes');
const dynamicRoutes  = require('./routes/dynamicRoutes');

app.use('/api/auth',       authRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/data',       dynamicRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend is running correctly.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Root route — useful for checking deployment
app.get('/', (_req, res) => {
  res.status(200).json({
    name: "Raj's Cafe API",
    version: '1.0.0',
    status: 'running',
    endpoints: ['/api/health', '/api/orders', '/api/data', '/api/auth', '/api/activities'],
  });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// ── Start server (local dev only) ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api`);
  });
}

// ── Export for Vercel serverless ───────────────────────────────────────────
module.exports = app;
