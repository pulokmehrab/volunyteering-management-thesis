const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find()
            .sort({ date: 1 })
            .populate('organizer', 'name')
            .populate('registeredVolunteers', 'name');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// Get upcoming events (for homepage)
router.get('/upcoming', async (req, res) => {
    try {
        const events = await Event.find({
            date: { $gte: new Date() },
            status: 'upcoming'
        })
        .sort({ date: 1 })
        .limit(5)
        .populate('organizer', 'name');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching upcoming events' });
    }
});

// Create new event (organizer only)
router.post('/', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'organizer') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const event = await Event.create({
            ...req.body,
            organizer: req.user.userId
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event' });
    }
});

// Update event (organizer only)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'organizer') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.organizer.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event' });
    }
});

// Register for event (volunteers)
router.post('/:id/register', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.registeredVolunteers.includes(req.user.userId)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        if (event.capacity > 0 && event.registeredVolunteers.length >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        event.registeredVolunteers.push(req.user.userId);
        await event.save();

        res.json({ message: 'Successfully registered for event' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering for event' });
    }
});

// Delete event (organizer only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'organizer') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.organizer.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event' });
    }
});

module.exports = router; 