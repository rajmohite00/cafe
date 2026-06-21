const express = require('express');
const router  = express.Router();
const { MenuItem, Reservation, Contact, BlogPost, SiteSetting } = require('../models/Dynamic');

const models = {
  menu:         MenuItem,
  reservations: Reservation,
  contacts:     Contact,
  posts:        BlogPost,
};

// Input validation middleware
const validateInput = (req, res, next) => {
  const { body } = req;
  
  // Basic XSS protection - sanitize string inputs
  for (const key in body) {
    if (typeof body[key] === 'string') {
      body[key] = body[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      body[key] = body[key].trim();
    }
  }
  
  next();
};

// Rate limiting simulation (basic check)
const requestCounts = new Map();
const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100; // 100 requests per minute
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
  } else {
    const data = requestCounts.get(ip);
    if (now > data.resetTime) {
      data.count = 1;
      data.resetTime = now + windowMs;
    } else {
      data.count++;
    }
    
    if (data.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }
  }
  
  next();
};

// Apply middleware
router.use(rateLimit);
router.use(validateInput);

// ── Singleton Settings (hours / seo / design) ──────────────────────────────
// GET  /api/data/settings/:key  → fetch one setting doc
router.get('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    // Validate key parameter
    if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid setting key format'
      });
    }
    
    const setting = await SiteSetting.findOne({ key });
    res.json({ success: true, data: setting });
  } catch (error) {
    console.error('Settings GET error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch setting'
    });
  }
});

// PUT  /api/data/settings/:key  → upsert (create or update) a setting doc
router.put('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    // Validate key parameter
    if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid setting key format'
      });
    }
    
    // Validate value exists
    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        message: 'Setting value is required'
      });
    }
    
    const setting = await SiteSetting.findOneAndUpdate(
      { key },
      { key, value, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    res.json({ success: true, data: setting });
  } catch (error) {
    console.error('Settings PUT error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update setting'
    });
  }
});

// ── Generic CRUD ───────────────────────────────────────────────────────────
router.get('/:resource', async (req, res) => {
  try {
    const { resource } = req.params;
    const Model = models[resource];
    
    if (!Model) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resource not found' 
      });
    }
    
    // Pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 items
    const skip = (page - 1) * limit;
    
    const data = await Model.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await Model.countDocuments();
    
    res.status(200).json({ 
      success: true, 
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(`GET /${req.params.resource} error:`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch data' 
    });
  }
});

router.post('/:resource', async (req, res) => {
  try {
    const { resource } = req.params;
    const Model = models[resource];
    
    if (!Model) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resource not found' 
      });
    }
    
    // Basic validation based on resource type
    if (resource === 'menu') {
      const { name, price } = req.body;
      if (!name || typeof price !== 'number' || price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Name and valid price are required for menu items'
        });
      }
    }
    
    if (resource === 'reservations') {
      const { name, email, date, time, guests } = req.body;
      if (!name || !email || !date || !time || !guests) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, date, time, and guests are required for reservations'
        });
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
    }
    
    const newItem = new Model({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error(`POST /${req.params.resource} error:`, error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create item' 
    });
  }
});

router.put('/:resource/:id', async (req, res) => {
  try {
    const { resource, id } = req.params;
    const Model = models[resource];
    
    if (!Model) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resource not found' 
      });
    }
    
    // Validate MongoDB ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    const updated = await Model.findByIdAndUpdate(
      id, 
      { 
        ...req.body, 
        updatedAt: new Date() 
      }, 
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(`PUT /${req.params.resource}/${req.params.id} error:`, error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update item' 
    });
  }
});

router.delete('/:resource/:id', async (req, res) => {
  try {
    const { resource, id } = req.params;
    const Model = models[resource];
    
    if (!Model) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resource not found' 
      });
    }
    
    // Validate MongoDB ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    const deleted = await Model.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Item deleted successfully',
      data: deleted
    });
  } catch (error) {
    console.error(`DELETE /${req.params.resource}/${req.params.id} error:`, error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete item' 
    });
  }
});

module.exports = router;
