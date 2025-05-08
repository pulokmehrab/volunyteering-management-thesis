import React from 'react';
import './donation.css';
import donationImage from './img5.jpg'; // Place your image in src/assets/

const Donation = () => {
  return (
    <div
      className="donation-section"
      style={{
        backgroundImage: `url(${donationImage})`,
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

          <form
            className="donation-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for your donation!');
            }}
          >
            <label htmlFor="amount">Donation Amount ($)</label>
            <input type="number" id="amount" placeholder="Enter amount" required />

            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" placeholder="Full name" required />

            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="example@email.com" required />

            <button type="submit" className="donate-btn">Donate Now</button>
          </form>

          <p className="note">* All donations are securely processed.</p>
        </div>
      </div>
    </div>
  );
};

export default Donation;
