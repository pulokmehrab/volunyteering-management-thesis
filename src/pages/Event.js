// src/pages/EventsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Event.css';

const API_URL = 'http://localhost:5000/api';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    capacity: 0,
    imageUrl: ''
  });

  useEffect(() => {
    // Check if user is organizer
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      setIsOrganizer(user.role === 'organizer');
    }
    // Fetch events
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Error fetching events');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/events`, newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewEvent({
        title: '',
        date: '',
        location: '',
        description: '',
        capacity: 0,
        imageUrl: ''
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Error creating event');
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/events/${eventId}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      setError('Error registering for event');
    }
  };

  if (loading) return <div className="events-page">Loading events...</div>;
  if (error) return <div className="events-page">Error: {error}</div>;

  return (
    <div className="events-container">
      {isOrganizer && (
        <div className="event-form">
          <h2>Create New Event</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={newEvent.location}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Event Description"
              value={newEvent.description}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Create Event</button>
          </form>
        </div>
      )}

      <div className="events-list">
        <h2>All Events</h2>
        {events.map(event => (
          <div key={event._id} className="event-card">
            <h3>{event.title}</h3>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
