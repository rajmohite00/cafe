const mongoose = require('mongoose');

const autoSchema = new mongoose.Schema({},{strict: false, timestamps: true});

exports.MenuItem = mongoose.model('MenuItem', autoSchema);
exports.Reservation = mongoose.model('Reservation', autoSchema);
exports.Contact = mongoose.model('Contact', autoSchema);
exports.BlogPost = mongoose.model('BlogPost', autoSchema);
