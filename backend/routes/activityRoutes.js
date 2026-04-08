const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// Get recent activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 }).limit(50);
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Post an activity
router.post('/', async (req, res) => {
  try {
    const { type, description } = req.body;
    let ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
    if (ipAddress === '::1' || ipAddress === '127.0.0.1') {
      ipAddress = 'Local User';
    }

    const newActivity = new Activity({
      type,
      description,
      ipAddress
    });

    await newActivity.save();
    res.status(201).json({ success: true, data: newActivity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
