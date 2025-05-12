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
    fetchEvents();
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsOrganizer(response.data.role === 'organizer');
    } catch (err) {
      console.error('Error checking user role:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
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
    } catch (err) {
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
    <div className="events-page">
      <h2 className="events-title">Events</h2>

      {isOrganizer && (
        <div className="event-form-container">
          <h3>Create New Event</h3>
          <form onSubmit={handleSubmit} className="event-form">
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              placeholder="Event Title"
              required
            />
            <input
              type="datetime-local"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="location"
              value={newEvent.location}
              onChange={handleInputChange}
              placeholder="Location"
              required
            />
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Event Description"
              required
            />
            <input
              type="number"
              name="capacity"
              value={newEvent.capacity}
              onChange={handleInputChange}
              placeholder="Capacity (0 for unlimited)"
              min="0"
            />
            <input
              type="text"
              name="imageUrl"
              value={newEvent.imageUrl}
              onChange={handleInputChange}
              placeholder="Image URL (optional)"
            />
            <button type="submit" className="create-event-btn">Create Event</button>
          </form>
        </div>
      )}

      <div className="events-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            {event.imageUrl && (
              <div className="event-image">
                <img src={event.imageUrl} alt={event.title} />
              </div>
            )}
            <div className="event-content">
              <h4>{event.title}</h4>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p>{event.description}</p>
              {event.capacity > 0 && (
                <p><strong>Spots available:</strong> {event.capacity - (event.registeredVolunteers?.length || 0)}</p>
              )}
              {!isOrganizer && (
                <button
                  onClick={() => handleRegister(event._id)}
                  className="register-btn"
                  disabled={event.registeredVolunteers?.includes(localStorage.getItem('userId'))}
                >
                  {event.registeredVolunteers?.includes(localStorage.getItem('userId'))
                    ? 'Already Registered'
                    : 'Register'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
