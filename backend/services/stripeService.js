const config = require('../config/config');
const stripe = require('stripe')(config.stripeSecretKey);

class StripeService {
    async createPaymentIntent(amount) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: 'usd',
                payment_method_types: ['card']
            });
            return paymentIntent;
        } catch (error) {
            console.error('Stripe payment intent error:', error);
            throw new Error('Failed to create payment intent');
        }
    }

    async retrievePaymentIntent(paymentIntentId) {
        try {
            return await stripe.paymentIntents.retrieve(paymentIntentId);
        } catch (error) {
            console.error('Stripe retrieve payment error:', error);
            throw new Error('Failed to retrieve payment intent');
        }
    }
}

module.exports = new StripeService(); 