const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: {
            values: ['volunteer', 'organizer'],
            message: '{VALUE} is not a valid role'
        },
        default: 'volunteer'
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true
    },
    categories: {
        type: [String],
        default: []
    },
    hours: {
        type: Number,
        default: 0,
        min: [0, 'Hours cannot be negative']
    },
    profilePicture: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Pre-save middleware to validate required fields for volunteers
userSchema.pre('save', function(next) {
    if (this.role === 'volunteer') {
        if (!this.name || !this.email || !this.contact) {
            next(new Error('Name, email, and contact are required for volunteers'));
            return;
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User; 
module.exports = mongoose.model('User', userSchema); 