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
        },
        startTime: {
            type: Date
        },
        endTime: {
            type: Date
        },
        hoursWorked: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

// Add method to check if shift is full
shiftSchema.methods.isFull = function() {
    return this.assignedUsers.length >= this.requiredVolunteers;
};

// Method to calculate hours worked by volunteers once the shift is completed
shiftSchema.methods.calculateHoursWorked = function() {
    this.attendance.forEach((record) => {
        if (record.startTime && record.endTime) {
            // Calculate difference in hours
            const duration = (new Date(record.endTime) - new Date(record.startTime)) / (1000 * 60 * 60); // hours
            record.hoursWorked = duration;
        }
    });
};

// Update status based on assigned users
shiftSchema.pre('save', function(next) {
    if (this.assignedUsers.length >= this.requiredVolunteers) {
        this.status = 'filled';
    }
    next();
});

module.exports = mongoose.model('Shift', shiftSchema);
