import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpcomingEvents.css';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch upcoming events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="events-loading">Loading events...</div>;
  if (error) return <div className="events-error">{error}</div>;
  if (events.length === 0) return <div className="no-events">No upcoming events</div>;

  return (
    <div className="upcoming-events-container">
      <h2>Upcoming Events</h2>
      <div className="events-grid">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            {event.imageUrl && (
              <div className="event-image">
                <img src={event.imageUrl} alt={event.title} />
              </div>
            )}
            <div className="event-content">
              <h3>{event.title}</h3>
              <p className="event-date">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="event-location">{event.location}</p>
              <p className="event-description">{event.description}</p>
              {event.capacity > 0 && (
                <p className="event-capacity">
                  Spots available: {event.capacity - (event.registeredVolunteers?.length || 0)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents; 