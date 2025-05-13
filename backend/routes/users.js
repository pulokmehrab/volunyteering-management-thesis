const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['volunteer', 'organizer'],
    required: true
  },
  contact: {
    type: String,
    required: false
  },
  categories: [{
    type: String,
    required: false
  }],
  hours: {
    type: Number,
    default: 0  // Track total hours worked by the volunteer
  },
  profilePicture: {
    type: String,
    required: false
  },
  lastLogin: {
    type: Date,
    required: false
  }
}, { timestamps: true });

// Update the last login time whenever the user logs in
userSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    this.lastLogin = new Date();
  }
  next();
});

// Example method to update hours worked
userSchema.methods.addHours = async function(hours) {
  this.hours += hours;
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
