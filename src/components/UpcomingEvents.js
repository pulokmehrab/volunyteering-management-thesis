import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './UpcomingEvents.css';

const API_URL = 'http://localhost:5000/api';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/upcoming`);
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching upcoming events');
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  if (loading) return <div className="upcoming-events-loading">Loading events...</div>;
  if (error) return <div className="upcoming-events-error">{error}</div>;
  if (events.length === 0) return null;

  return (
    <section className="upcoming-events-section">
      <h2>Upcoming Events</h2>
      <div className="upcoming-events-grid">
        {events.map((event) => (
          <div key={event._id} className="upcoming-event-card">
            {event.imageUrl && (
              <div className="event-image">
                <img src={event.imageUrl} alt={event.title} />
              </div>
            )}
            <div className="event-details">
              <h3>{event.title}</h3>
              <p className="event-date">
                {new Date(event.date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="event-location">{event.location}</p>
              <p className="event-description">{event.description}</p>
              <Link to="/events" className="view-more-btn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Link to="/events" className="see-all-events">
        See All Events →
      </Link>
    </section>
  );
};

export default UpcomingEvents; 