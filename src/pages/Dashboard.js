import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';  // Ensure this CSS file is correctly imported

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const [shifts, setShifts] = useState([]);  // Initialize as empty array
  const [appliedShifts, setAppliedShifts] = useState([]);  // Initialize as empty array
  const [assignedShifts, setAssignedShifts] = useState([]);  // Initialize as empty array
  const [userData, setUserData] = useState({ name: '', totalHours: 0, upcomingShifts: [] });
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found, please log in');

        // Fetch user data
        const userResponse = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(userResponse.data);

        // Fetch assigned shifts (specific to volunteer)
        const shiftsResponse = await axios.get(`${API_URL}/shifts/volunteer/${userResponse.data._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssignedShifts(shiftsResponse.data);

        // Fetch available shifts
        const availableShiftsResponse = await axios.get(`${API_URL}/shifts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShifts(availableShiftsResponse.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const applyForShift = async (shiftId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/shifts/apply/${shiftId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.message === 'Successfully applied for shift') {
        setAppliedShifts([...appliedShifts, shiftId]);
        alert('Shift application successful!');
      }
    } catch (error) {
      console.error('Error applying for shift:', error);
      alert('Failed to apply for shift.');
    }
  };

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Volunteer Dashboard</h1>
      <div className="dashboard-container">
        
        {/* Profile Section */}
        <div className="profile-section">
          <h2>My Profile</h2>
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>
          <div className="profile-picture-section">
            <h3>Profile Picture</h3>
            <input type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} />
            {profilePicture && <img src={URL.createObjectURL(profilePicture)} alt="Profile" />}
          </div>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Total Hours Volunteered:</strong> {userData.totalHours} hours</p>
          <p><strong>Upcoming Shifts:</strong></p>
          <ul>
            {userData.upcomingShifts && userData.upcomingShifts.length > 0 ? userData.upcomingShifts.map((shift) => (
              <li key={shift.id}>
                <strong>Date:</strong> {shift.date}<br />
                <strong>Location:</strong> {shift.location}<br />
                <strong>Location Manager:</strong> {shift.manager}<br />
                <strong>Contact:</strong> {shift.contact}
              </li>
            )) : <p>No upcoming shifts</p>}
          </ul>
        </div>

        {/* Assigned Shifts */}
        <div className="assigned-shifts">
          <h2>Assigned Shifts</h2>
          <ul>
            {assignedShifts && assignedShifts.length > 0 ? assignedShifts.map((shift) => (
              <li key={shift._id}>
                <div className="shift-details">
                  <strong>Date:</strong> {shift.date}, <strong>Time:</strong> {shift.time}, <strong>Location:</strong> {shift.location}, <strong>Task:</strong> {shift.task}
                </div>
              </li>
            )) : <p>No assigned shifts available</p>}
          </ul>
        </div>

        {/* Available Shifts */}
        <div className="available-shifts">
  <h2 className="section-title">Available Shifts</h2>
  <div className="shift-cards-container">
    {shifts && shifts.length > 0 ? shifts.map((shift) => (
      <div key={shift._id} className="shift-card">
        <div className="shift-details">
          <h3 className="shift-task">{shift.task}</h3>
          <p><strong>Date:</strong> {shift.date}</p>
          <p><strong>Time:</strong> {shift.time}</p>
          <p><strong>Location:</strong> {shift.location}</p>
        </div>
        <button 
          className="apply-btn" 
          onClick={() => applyForShift(shift._id)} 
          disabled={appliedShifts.includes(shift._id)}
        >
          {appliedShifts.includes(shift._id) ? 'Applied' : 'Apply'}
        </button>
      </div>
    )) : <p>No available shifts</p>}
  </div>
</div>

      </div>
    </div>
  );
};

export default Dashboard;
