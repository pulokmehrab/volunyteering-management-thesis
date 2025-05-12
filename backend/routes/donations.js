const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const Donation = require('../models/Donation');
const User = require('../models/User');
const stripeService = require('../services/stripeService');

// Create payment intent
router.post('/create-payment-intent', verifyToken, async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount || amount < 1) {
            return res.status(400).json({ message: 'Invalid donation amount' });
        }

        const paymentIntent = await stripeService.createPaymentIntent(amount);
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Payment intent error:', error);
        res.status(500).json({ message: 'Error creating payment intent' });
    }
});

// Create donation record
router.post('/', verifyToken, async (req, res) => {
    try {
        const { amount, charity, message, paymentId } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify payment with Stripe
        const paymentIntent = await stripeService.retrievePaymentIntent(paymentId);
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ message: 'Payment not successful' });
        }

        const donation = await Donation.create({
            amount,
            donor: user._id,
            donorName: user.name,
            email: user.email,
            message,
            charity,
            paymentId,
            status: 'completed'
        });

        res.status(201).json(donation);
    } catch (error) {
        console.error('Donation creation error:', error);
        res.status(500).json({ message: 'Error creating donation record' });
    }
});

// Get all donations (admin only)
router.get('/', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'organizer') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const donations = await Donation.find({ status: 'completed' })
            .sort({ createdAt: -1 })
            .populate('donor', 'name role');
        
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donations' });
    }
});

// Get user's donations
router.get('/my-donations', verifyToken, async (req, res) => {
    try {
        const donations = await Donation.find({ 
            donor: req.user.userId,
            status: 'completed'
        }).sort({ createdAt: -1 });
        
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your donations' });
    }
});

// Get donation statistics
router.get('/statistics', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'organizer') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const stats = await Donation.aggregate([
            { $match: { status: 'completed' } },
            { 
                $group: {
                    _id: '$charity',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalDonated = await Donation.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const recentDonations = await Donation.find({ status: 'completed' })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('donor', 'name role');

        res.json({
            charityStats: stats,
            totalDonated: totalDonated[0]?.total || 0,
            recentDonations
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donation statistics' });
    }
});

module.exports = router; 