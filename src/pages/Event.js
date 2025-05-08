// src/pages/EventsPage.js
import React from 'react';
import './Event.css';

const events = [
  {
    title: 'Food Drive Event',
    date: '2024-06-10',
    location: 'City Hall',
    description: 'Join us in distributing food and essentials to those in need.',
  },
  {
    title: 'Tree Planting Day',
    date: '2024-06-20',
    location: 'Community Park',
    description: 'Help us plant trees and contribute to a greener environment.',
  },
];

const EventsPage = () => {
  return (
    <div className="events-page">
      <h2 className="events-title">Upcoming Events</h2>
      <div className="events-list">
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <h4>{event.title}</h4>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
