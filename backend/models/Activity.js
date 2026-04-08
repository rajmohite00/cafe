const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // e.g., 'visit', 'order_placed', 'contact_sent'
  },
  description: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    default: 'Unknown'
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Activity', activitySchema);
