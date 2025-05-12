const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donorName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    charity: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema); 