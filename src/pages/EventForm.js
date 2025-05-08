import React, { useState } from 'react';
import './eventform.css';

const EventForm = ({ onEventCreate }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [maxVolunteers, setMaxVolunteers] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      id: Date.now(),
      title,
      date,
      location,
      description,
      maxVolunteers,
    };

    onEventCreate(newEvent); // send to parent or backend
    alert('Event published successfully!');
    
    // Reset form
    setTitle('');
    setDate('');
    setLocation('');
    setDescription('');
    setMaxVolunteers('');
  };

  return (
    <div className="event-form-container">
      <h2>Publish a New Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" required />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Event Description" rows="4" required />
        <input type="number" value={maxVolunteers} onChange={e => setMaxVolunteers(e.target.value)} placeholder="Max Volunteers" required />
        <button type="submit" className="event-submit-btn">Publish Event</button>
      </form>
    </div>
  );
};

export default EventForm;
