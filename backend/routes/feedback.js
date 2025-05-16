const express = require('express');
const router = express.Router();
const Feedback = require('../models/Fedback');
const { verifyToken } = require('./auth');

// POST: Submit feedback
router.post('/', verifyToken, async (req, res) => {
  try {
    const { feedback } = req.body;
    const userId = req.user.userId;  // Assuming `req.user.id` comes from the authentication middleware
    console.log(userId);

    const newFeedback = new Feedback({ userId, feedback, createdAt: Date.now() });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

// GET: Get all feedback (for admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('userId', 'name email');
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

module.exports = router;
