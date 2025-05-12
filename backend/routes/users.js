const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const User = require('../models/User');
const Shift = require('../models/Shift');

// Get all volunteers (protected, organizer only)
router.get('/volunteers', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'organizer') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const volunteers = await User.find({ role: 'volunteer' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { name, email, contact, categories } = req.body;
        
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (contact) user.contact = contact;
        if (categories) user.categories = categories;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update volunteer hours (organizer only)
router.put('/volunteers/:id/hours', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'organizer') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { hours } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user || user.role !== 'volunteer') {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        user.hours = hours;
        await user.save();

        res.json({ message: 'Hours updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete volunteer (organizer only)
router.delete('/volunteers/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'organizer') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'volunteer') {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        await user.remove();
        res.json({ message: 'Volunteer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get volunteer statistics
router.get('/statistics', verifyToken, async (req, res) => {
    try {
        // Get total volunteers
        const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
        
        // Get volunteers by category
        const volunteersByCategory = await User.aggregate([
            { $match: { role: 'volunteer' } },
            { $unwind: '$categories' },
            { $group: { _id: '$categories', count: { $sum: 1 } } }
        ]);

        // Get top 10 volunteers by hours
        const topVolunteers = await User.find({ role: 'volunteer' })
            .select('name hours categories')
            .sort({ hours: -1 })
            .limit(10);

        // Get shifts statistics
        const shifts = await Shift.find();
        const completedShifts = shifts.filter(s => s.status === 'completed').length;
        const openShifts = shifts.filter(s => s.status === 'open').length;

        // Calculate average hours per volunteer
        const allVolunteers = await User.find({ role: 'volunteer' });
        const totalHours = allVolunteers.reduce((sum, vol) => sum + (vol.hours || 0), 0);
        const avgHours = totalHours / (totalVolunteers || 1);

        // Get hours by category
        const hoursByCategory = await User.aggregate([
            { $match: { role: 'volunteer' } },
            { $unwind: '$categories' },
            { $group: { 
                _id: '$categories', 
                totalHours: { $sum: '$hours' }
            }}
        ]);

        // Calculate participation percentage by category
        const participationByCategory = volunteersByCategory.map(cat => ({
            category: cat._id,
            percentage: (cat.count / totalVolunteers) * 100
        }));

        // Get currently active volunteers (logged in within last 24 hours)
        const activeVolunteers = await User.find({
            role: 'volunteer',
            lastLogin: { 
                $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
            }
        }).select('name email categories lastLogin');

        res.json({
            totalVolunteers,
            volunteersByCategory,
            topVolunteers,
            completedShifts,
            openShifts,
            avgHours,
            hoursByCategory,
            participationByCategory,
            activeVolunteers
        });
    } catch (error) {
        console.error('Statistics error:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
});

module.exports = router; 