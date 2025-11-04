const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  program: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['driver', 'rider', 'both'],
    default: 'rider'
  },
  carDetails: {
    make: String,
    model: String,
    year: Number,
    color: String,
    licensePlate: String
  },
  isAdmin: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);