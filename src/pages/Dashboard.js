import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const [shifts, setShifts] = useState([]);  // Initialize as empty array
  const [appliedShifts, setAppliedShifts] = useState([]);  // Initialize as empty array
  const [assignedShifts, setAssignedShifts] = useState([]);  // Initialize as empty array
  const [userData, setUserData] = useState({ name: '', totalHours: 0, upcomingShifts: [] });
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // To toggle between edit mode and view mode
  const [updatedUserData, setUpdatedUserData] = useState({ name: '', contact: '', email: '' });

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
        setUpdatedUserData({
          name: userResponse.data.name,
          contact: userResponse.data.contact,
          email: userResponse.data.email
        });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/users/profile`, updatedUserData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData({ ...userData, ...updatedUserData });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile.');
    }
  };

  // Apply for a shift
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

  // Mark shift as completed
  const completeShift = async (shiftId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/shifts/${shiftId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.message === 'Shift completed successfully') {
        // Update the assigned shifts after completion
        const updatedShifts = assignedShifts.map(shift => {
          if (shift._id === shiftId) {
            shift.status = 'completed';
            shift.hoursWorked = 4; // This can be dynamic based on shift duration
          }
          return shift;
        });
        setAssignedShifts(updatedShifts);
        alert('Shift completed successfully!');
      }
    } catch (error) {
      console.error('Error completing shift:', error);
      alert('Failed to complete shift.');
    }
  };

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Volunteer Dashboard</h1>
      <div className="dashboard-container">

        {/* Profile Section */}
        <div className="profile-section">
          <h2>My Profile</h2>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>

          <div className="profile-picture-section">
            <h3>Profile Picture</h3>
            <input type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} />
            {profilePicture && <img src={URL.createObjectURL(profilePicture)} alt="Profile" />}
          </div>

          <div className="profile-info">
            <div>
              <strong>Name:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={updatedUserData.name}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{userData.name}</span>
              )}
            </div>
            <div>
              <strong>Email:</strong>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={updatedUserData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{userData.email}</span>
              )}
            </div>
            <div>
              <strong>Contact:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="contact"
                  value={updatedUserData.contact}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{userData.contact}</span>
              )}
            </div>
            <div>
              <strong>Total Hours Volunteered:</strong> {userData.totalHours} hours
            </div>
            <div>
              {isEditing ? (
                <button onClick={handleSaveProfile} className="save-btn">Save Profile</button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
              )}
            </div>
          </div>
        </div>

        {/* Assigned Shifts */}
        <div className="assigned-shifts">
          <h2>Assigned Shifts</h2>
          <div className="shift-cards-container">
            {assignedShifts && assignedShifts.length > 0 ? assignedShifts.map((shift) => (
              <div key={shift._id} className="shift-card">
                <div className="shift-details">
                  <strong>Date:</strong> {shift.date}, <strong>Time:</strong> {shift.time}, <strong>Location:</strong> {shift.location}, <strong>Task:</strong> {shift.task}, <strong>Hours Worked:</strong> {shift.hoursWorked || 'Not available'}
                </div>
                {shift.status !== 'completed' && (
                  <button onClick={() => completeShift(shift._id)} className="complete-btn">
                    Mark as Completed
                  </button>
                )}
              </div>
            )) : <p>No assigned shifts available</p>}
          </div>
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
