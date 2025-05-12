import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './admin-dashboard.css';
import Statistics from './Statistics';
import EventForm from './EventForm';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Volunteers');
  const [volunteers, setVolunteers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [assignedShifts, setAssignedShifts] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [newShift, setNewShift] = useState({
    date: '',
    time: '',
    location: '',
    task: '',
    description: '',
    requiredVolunteers: 1
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'organizer') {
      navigate('/login');
      return;
    }

    // Set up axios defaults
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    fetchVolunteers();
    fetchAssignedShifts();
    fetchShifts();
  }, [navigate]);

  const fetchVolunteers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/volunteers`);
      setVolunteers(response.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    }
  };

  const fetchAssignedShifts = async () => {
    try {
      const response = await axios.get(`${API_URL}/shifts`);
      const shifts = response.data;
      setAssignedShifts(shifts);
      setDates([...new Set(shifts.map(s => s.date))]);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await axios.get(`${API_URL}/shifts`);
      setShifts(response.data);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/volunteers/${id}`);
      setVolunteers(v => v.filter(vol => vol._id !== id));
    } catch (error) {
      console.error('Error deleting volunteer:', error);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const locs = [...new Set(assignedShifts.filter(s => s.date === date).map(s => s.location))];
    setLocations(locs);
    setSelectedLocation('');
  };

  const handleLocationChange = (e) => setSelectedLocation(e.target.value);

  const handleToggleAttendance = async (shiftId) => {
    try {
      const newAttendance = !attendance[shiftId];
      await axios.put(`${API_URL}/shifts/${shiftId}/attendance`, {
        attended: newAttendance
      });
      
      setAttendance((prev) => ({
        ...prev,
        [shiftId]: newAttendance,
      }));

      // Update volunteer hours if attended
      if (newAttendance) {
        const shift = assignedShifts.find(s => s._id === shiftId);
        const volunteer = volunteers.find(v => v._id === shift.assignedUsers[0]);
        if (volunteer) {
          const hours = volunteer.hours + 4; // Assuming 4 hours per shift
          await axios.put(`${API_URL}/users/volunteers/${volunteer._id}/hours`, { hours });
          setVolunteers(prevVolunteers =>
            prevVolunteers.map(v =>
              v._id === volunteer._id ? { ...v, hours } : v
            )
          );
        }
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleCreateShift = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/shifts`, newShift);
      setNewShift({
        date: '',
        time: '',
        location: '',
        task: '',
        description: '',
        requiredVolunteers: 1
      });
      fetchShifts();
    } catch (error) {
      console.error('Error creating shift:', error);
    }
  };

  const handleAssignVolunteers = async (shiftId, userIds) => {
    try {
      await axios.post(`${API_URL}/shifts/${shiftId}/assign`, { userIds });
      fetchShifts();
    } catch (error) {
      console.error('Error assigning volunteers:', error);
    }
  };

  const handleUpdateAttendance = async (shiftId, userId, attended) => {
    try {
      await axios.put(`${API_URL}/shifts/${shiftId}/attendance`, { userId, attended });
      fetchShifts();
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const handleCancelShift = async (shiftId) => {
    try {
      await axios.put(`${API_URL}/shifts/${shiftId}/cancel`);
      fetchShifts();
    } catch (error) {
      console.error('Error cancelling shift:', error);
    }
  };

  const filteredVolunteers = searchQuery.trim() 
    ? volunteers.filter(v => v.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : volunteers;

  const filteredShifts = assignedShifts.filter(
    s => s.date === selectedDate && (!selectedLocation || s.location === selectedLocation)
  );

  const renderVolunteers = () => (
    <section className="volunteers-section">
      <h1>Volunteers Management</h1>
      <input type="text" placeholder="Search by name" value={searchQuery} onChange={handleSearchChange} className="search-bar" />
      <div className="volunteer-list">
        {filteredVolunteers.map(v => (
          <div key={v._id} className="volunteer-item">
            <div className="volunteer-image-container">
              <img 
                src={v.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSweN5K2yaBwZpz5W9CxY9S41DI-2LawmjzYw&s'} 
                alt={v.name} 
                className="volunteer-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSweN5K2yaBwZpz5W9CxY9S41DI-2LawmjzYw&s';
                }}
              />
            </div>
            <div className="volunteer-details">
              <p><strong>Name:</strong> {v.name}</p>
              <p><strong>Email:</strong> {v.username}</p>
              <p><strong>Contact:</strong> {v.contact}</p>
              <p><strong>Categories:</strong> {v.categories?.join(', ')}</p>
              <p><strong>Hours Volunteered:</strong> {v.hours} hrs</p>
            </div>
            <button onClick={() => handleDelete(v._id)} className="delete-btn">Delete</button>
          </div>
        ))}
      </div>
    </section>
  );

  const renderShifts = () => (
    <section className="shifts-section">
      <h1>Manage Shifts</h1>
      
      {/* Create New Shift Form */}
      <div className="create-shift-form">
        <h2>Create New Shift</h2>
        <form onSubmit={handleCreateShift}>
          <input
            type="date"
            value={newShift.date}
            onChange={(e) => setNewShift({...newShift, date: e.target.value})}
            required
          />
          <input
            type="time"
            value={newShift.time}
            onChange={(e) => setNewShift({...newShift, time: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newShift.location}
            onChange={(e) => setNewShift({...newShift, location: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Task"
            value={newShift.task}
            onChange={(e) => setNewShift({...newShift, task: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            value={newShift.description}
            onChange={(e) => setNewShift({...newShift, description: e.target.value})}
          />
          <input
            type="number"
            min="1"
            placeholder="Required Volunteers"
            value={newShift.requiredVolunteers}
            onChange={(e) => setNewShift({...newShift, requiredVolunteers: parseInt(e.target.value)})}
            required
          />
          <button type="submit">Create Shift</button>
        </form>
      </div>

      {/* Shifts List */}
      <div className="shifts-list">
        <h2>Current Shifts</h2>
        {shifts.map(shift => (
          <div key={shift._id} className="shift-item">
            <div className="shift-details">
              <h3>{shift.task}</h3>
              <p><strong>Date:</strong> {shift.date}</p>
              <p><strong>Time:</strong> {shift.time}</p>
              <p><strong>Location:</strong> {shift.location}</p>
              <p><strong>Status:</strong> {shift.status}</p>
              <p><strong>Required Volunteers:</strong> {shift.requiredVolunteers}</p>
              <p><strong>Description:</strong> {shift.description}</p>
            </div>

            <div className="shift-volunteers">
              <h4>Assigned Volunteers ({shift.assignedUsers.length}/{shift.requiredVolunteers})</h4>
              {shift.assignedUsers.map(user => (
                <div key={user._id} className="assigned-volunteer">
                  <span>{user.name}</span>
                  <label>
                    <input
                      type="checkbox"
                      checked={shift.attendance.find(a => a.user === user._id)?.attended || false}
                      onChange={(e) => handleUpdateAttendance(shift._id, user._id, e.target.checked)}
                    />
                    Attended
                  </label>
                </div>
              ))}
            </div>

            <div className="shift-actions">
              {shift.status === 'open' && (
                <button onClick={() => handleAssignVolunteers(shift._id, [/* Select volunteers */])}>
                  Assign Volunteers
                </button>
              )}
              {['open', 'filled'].includes(shift.status) && (
                <button onClick={() => handleCancelShift(shift._id)}>Cancel Shift</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Volunteers': return renderVolunteers();
      case 'Shifts': return renderShifts();
      case 'Statistics': return <Statistics />;
      default: return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          {['Volunteers', 'Shifts', 'Statistics'].map(tab => (
            <li key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
              {tab}
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </aside>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
