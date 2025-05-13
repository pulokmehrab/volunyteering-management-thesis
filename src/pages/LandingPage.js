// pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import UpcomingEvents from '../components/UpcomingEvents';
import ChatBot from '../components/ChatBot';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Make a Difference</h1>
          <p>Join our community of volunteers and help create positive change</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">Get Started</Link>
            <Link to="/about" className="cta-button secondary">Learn More</Link>
          </div>
        </div>
      </section>

      <UpcomingEvents />

      <section className="features-section">
        <h2>Why Volunteer With Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-hands-helping"></i>
            <h3>Make an Impact</h3>
            <p>Contribute to meaningful causes and help those in need</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-users"></i>
            <h3>Join a Community</h3>
            <p>Connect with like-minded individuals who share your passion</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-certificate"></i>
            <h3>Gain Experience</h3>
            <p>Develop new skills and enhance your resume</p>
          </div>
        </div>
      </section>

      <ChatBot />
    </div>
  );
};

export default LandingPage;
