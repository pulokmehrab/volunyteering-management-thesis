// pages/LandingPage.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './LandingPage.css';
import volunteerImage from './img3.png'


const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <Container>
          <Row className="align-items-center text-center text-md-start">
            <Col md={6}>
              <h1>Empower Change with Volunteer Management</h1>
              <p>
                Organize, track, and support volunteers effortlessly. Join the future of community service with our platform.
              </p>
              <Button variant="primary" size="lg">Get Started</Button>
            </Col>
            <Col md={6}>
            <img src={volunteerImage} alt="Volunteering" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="features-section bg-light py-5">
        <Container>
          <Row>
            <Col md={4}>
              <h4>Easy Registration</h4>
              <p>Volunteers can sign up quickly and get started immediately.</p>
            </Col>
            <Col md={4}>
              <h4>Track Contributions</h4>
              <p>Monitor hours and contributions to recognize top performers.</p>
            </Col>
            <Col md={4}>
              <h4>Smart Scheduling</h4>
              <p>Coordinate shifts and events with a user-friendly calendar system.</p>
            </Col>
          </Row>
        </Container>
      </section>

      <footer className="footer bg-dark text-white py-4">
        <Container className="text-center">
          <p>© {new Date().getFullYear()} Volunteer Management. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
