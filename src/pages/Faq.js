// src/pages/FaqPage.js
import React from 'react';
import './Faq.css';

const faqs = [
  {
    question: 'How can I register as a volunteer?',
    answer: 'Click on the Sign Up button, fill out the registration form, and choose your role as Volunteer.',
  },
  {
    question: 'How do I apply for an event shift?',
    answer: 'Once logged in, go to your Dashboard and browse available shifts under the Events tab.',
  },
  {
    question: 'How is my attendance tracked?',
    answer: 'Organizers mark attendance through the Admin Dashboard after each shift.',
  },
  {
    question: 'Can I cancel a shift?',
    answer: 'Yes, go to your assigned shifts section and click "Cancel" next to the shift.',
  },
];

const FaqPage = () => {
  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div key={idx} className="faq-item">
            <h5 className="faq-question">{faq.question}</h5>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
