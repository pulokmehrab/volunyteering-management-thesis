require('dotenv').config();

module.exports = {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'your_stripe_test_secret_key',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/volunteer-system',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    port: process.env.PORT || 5000
}; 