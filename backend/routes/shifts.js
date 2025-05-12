const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const Shift = require('../models/Shift');
const User = require('../models/User');

// Get all shifts with filtering options
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, date, location } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (date) query.date = date;
    if (location) query.location = location;

    const shifts = await Shift.find(query)
      .populate('appliedUsers', 'username name email')
      .populate('assignedUsers', 'username name email')
      .populate('attendance.user', 'username name');
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new shift (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { date, time, location, task, description, requiredVolunteers } = req.body;
    const shift = await Shift.create({
      date,
      time,
      location,
      task,
      description,
      requiredVolunteers
    });

    res.status(201).json(shift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply for a shift
router.post('/apply/:shiftId', verifyToken, async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.shiftId);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    if (shift.status !== 'open') {
      return res.status(400).json({ message: 'This shift is not open for applications' });
    }

    if (shift.appliedUsers.includes(req.user.userId)) {
      return res.status(400).json({ message: 'You have already applied for this shift' });
    }

    shift.appliedUsers.push(req.user.userId);
    await shift.save();

    res.json({ message: 'Successfully applied for shift' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign volunteers to a shift (admin only)
router.post('/:shiftId/assign', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { userIds } = req.body;
    const shift = await Shift.findById(req.params.shiftId);

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    // Add new assignments and create attendance records
    for (const userId of userIds) {
      if (!shift.assignedUsers.includes(userId)) {
        shift.assignedUsers.push(userId);
        shift.attendance.push({ user: userId, attended: false });
      }
    }

    await shift.save();
    res.json({ message: 'Volunteers assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update attendance for a shift (admin only)
router.put('/:shiftId/attendance', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { userId, attended } = req.body;
    const shift = await Shift.findById(req.params.shiftId);

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    // Update attendance
    const attendanceRecord = shift.attendance.find(a => a.user.toString() === userId);
    if (attendanceRecord) {
      attendanceRecord.attended = attended;
    }

    // If attended, update volunteer's hours
    if (attended) {
      const user = await User.findById(userId);
      if (user) {
        user.hours = (user.hours || 0) + 4; // Assuming 4 hours per shift
        await user.save();
      }
    }

    await shift.save();
    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a shift (admin only)
router.put('/:shiftId/cancel', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const shift = await Shift.findById(req.params.shiftId);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    shift.status = 'cancelled';
    await shift.save();

    res.json({ message: 'Shift cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shifts for a specific volunteer
router.get('/volunteer/:userId', verifyToken, async (req, res) => {
  try {
    const shifts = await Shift.find({
      $or: [
        { assignedUsers: req.params.userId },
        { appliedUsers: req.params.userId }
      ]
    }).populate('assignedUsers', 'username name email');
    
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
