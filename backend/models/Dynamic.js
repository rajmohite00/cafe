const mongoose = require('mongoose');
const { getModelProxy } = require('../utils/dbFallback');

const autoSchema = new mongoose.Schema({},{strict: false, timestamps: true});

exports.MenuItem    = getModelProxy('menu',         mongoose.model('MenuItem',    autoSchema));
exports.Reservation = getModelProxy('reservations', mongoose.model('Reservation', autoSchema));
exports.Contact     = getModelProxy('contacts',     mongoose.model('Contact',     autoSchema));
exports.BlogPost    = getModelProxy('posts',        mongoose.model('BlogPost',    autoSchema));
exports.SiteSetting = getModelProxy('settings',     mongoose.model('SiteSetting', autoSchema));

