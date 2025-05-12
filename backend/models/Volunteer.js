const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    categories: [{
        type: String
    }],
    hours: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String,
        default: 'https://via.placeholder.com/50'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Volunteer', volunteerSchema); 