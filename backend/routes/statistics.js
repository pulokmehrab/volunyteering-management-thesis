const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const User = require('../models/User');
const Shift = require('../models/Shift');

// Middleware to check if the user is authenticated and is an organizer
router.get('/statistics', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Fetch total number of volunteers
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });

    // Fetch completed shifts
    const completedShifts = await Shift.countDocuments({ status: 'completed' });

    // Fetch open shifts
    const openShifts = await Shift.countDocuments({ status: 'open' });

    // Calculate average hours volunteered
    const avgHours = await User.aggregate([
      { $match: { role: 'volunteer' } },
      { $group: { _id: null, avgHours: { $avg: '$hours' } } }
    ]);

    // Get active volunteers within the last 24 hours
    const activeVolunteers = await User.find({
      role: 'volunteer',
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    // Get volunteers by category
    const volunteersByCategory = await User.aggregate([
      { $match: { role: 'volunteer' } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } }
    ]);

    // Get total hours volunteered by category
    const hoursByCategory = await User.aggregate([
      { $match: { role: 'volunteer' } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', totalHours: { $sum: '$hours' } } }
    ]);

    // Calculate volunteer participation percentage by category
    const participationByCategory = volunteersByCategory.map(cat => ({
      category: cat._id,
      percentage: (cat.count / totalVolunteers) * 100
    }));

    // Get top volunteers based on hours worked
    const topVolunteers = await User.find({ role: 'volunteer' })
      .sort({ hours: -1 })
      .limit(10)
      .select('name hours');

    res.json({
      totalVolunteers,
      completedShifts,
      openShifts,
      avgHours: avgHours[0]?.avgHours || 0,
      activeVolunteers,
      volunteersByCategory,
      hoursByCategory,
      participationByCategory,
      topVolunteers,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
