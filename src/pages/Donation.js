import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import './donation.css';
// import donationImage from './img5.jpg'; // Place your image in src/assets/
import StripeCardElement from '../components/StripeCardElement';
import DonationStats from '../components/DonationStats';

// Initialize Stripe outside of the component to optimize performance
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'your_publishable_key');

const DonationForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    name: '',
    email: '',
    message: '',
    charity: 'General Fund', // Default charity
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsOrganizer(response.data.role === 'organizer');
      } catch (err) {
        console.error('Error checking user role:', err);
      }
    };
    checkRole();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const response = await axios.post(
        'http://localhost:5000/api/donations/create-payment-intent',
        { amount: parseFloat(formData.amount) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const { clientSecret } = response.data;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.name,
            email: formData.email,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Create donation record
      await axios.post(
        'http://localhost:5000/api/donations',
        {
          ...formData,
          paymentId: result.paymentIntent.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert('Thank you for your donation!');
      setFormData({
        amount: '',
        name: '',
        email: '',
        message: '',
        charity: 'General Fund',
      });
    } catch (err) {
      setError(err.message || 'An error occurred while processing your donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-page">
      <div
        className="donation-section"
        style={{
          // backgroundImage: `url(${donationImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="donation-overlay">
          <div className="donation-card">
            <h2 className="donation-title">Support Our Cause</h2>
            <p className="donation-text">
              Your contribution helps us empower volunteers and make a difference in our communities.
            </p>

            {error && <div className="error-message">{error}</div>}

            <form className="donation-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="amount">Donation Amount ($)</label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Leave a message..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="charity">Select Charity</label>
                <select
                  id="charity"
                  value={formData.charity}
                  onChange={handleInputChange}
                  required
                >
                  <option value="General Fund">General Fund</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Environment">Environment</option>
                </select>
              </div>

              <div className="form-group">
                <label>Card Details</label>
                <StripeCardElement />
              </div>

              <button
                type="submit"
                className="donate-btn"
                disabled={loading || !stripe}
              >
                {loading ? 'Processing...' : 'Donate Now'}
              </button>
            </form>

            <p className="note">
              * All donations are securely processed through Stripe. Your payment information is encrypted and secure.
            </p>
          </div>
        </div>
      </div>

      {isOrganizer && (
        <div className="stats-section">
          <DonationStats />
        </div>
      )}
    </div>
  );
};

const Donation = () => {
  return (
    <Elements stripe={stripePromise}>
      <DonationForm />
    </Elements>
  );
};

export default Donation;
