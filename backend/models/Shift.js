const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    requiredVolunteers: {
        type: Number,
        default: 1
    },
    appliedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    assignedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['open', 'filled', 'completed', 'cancelled'],
        default: 'open'
    },
    attendance: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        attended: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
});

// Add method to check if shift is full
shiftSchema.methods.isFull = function() {
    return this.assignedUsers.length >= this.requiredVolunteers;
};

// Update status based on assigned users
shiftSchema.pre('save', function(next) {
    if (this.assignedUsers.length >= this.requiredVolunteers) {
        this.status = 'filled';
    }
    next();
});

module.exports = mongoose.model('Shift', shiftSchema); 