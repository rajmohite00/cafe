const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const { getModelProxy } = require('../utils/dbFallback');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const userModel = mongoose.model('User', userSchema);
module.exports = getModelProxy('users', userModel);

