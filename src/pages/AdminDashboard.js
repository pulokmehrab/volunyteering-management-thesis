import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin-dashboard.css';
import Statistics from './Statistics';
import EventForm from './EventForm'; // Optional if you add publishing tab

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

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'organizer') navigate('/login');
    fetchVolunteers();
    fetchAssignedShifts();
  }, [navigate]);

  const fetchVolunteers = () => {
    setVolunteers([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        contact: '+41 79 123 4567',
        categories: ['Hostess', 'Shop'],
        hours: 20,
        profilePicture: 'https://via.placeholder.com/50',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        contact: '+41 79 987 6543',
        categories: ['Bar/Service', 'Accreditation'],
        hours: 35,
        profilePicture: 'https://via.placeholder.com/50',
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        contact: '+41 79 555 4321',
        categories: ['Cloakroom', 'Technical Support'],
        hours: 15,
        profilePicture: 'https://via.placeholder.com/50',
      },
    ]);
  };

  const fetchAssignedShifts = () => {
    const mockShifts = [
      {
        id: 1,
        volunteerId: 1,
        date: '2024-10-21',
        time: '10:00-14:00',
        location: 'Frauenbadi',
        task: 'Ushering',
      },
      {
        id: 2,
        volunteerId: 2,
        date: '2024-10-22',
        time: '12:00-16:00',
        location: 'Kongresshaus',
        task: 'Ticketing',
      },
      {
        id: 3,
        volunteerId: 3,
        date: '2024-10-21',
        time: '12:00-10:00',
        location: 'Kongresshaus',
        task: 'Cloakroom',
      },
    ];
    setAssignedShifts(mockShifts);
    setDates([...new Set(mockShifts.map(s => s.date))]);
  };

  const handleDelete = (id) => setVolunteers(v => v.filter(vol => vol.id !== id));
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleCancelShift = (id) => setAssignedShifts(s => s.filter(shift => shift.id !== id));

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const locs = [...new Set(assignedShifts.filter(s => s.date === date).map(s => s.location))];
    setLocations(locs);
    setSelectedLocation('');
  };

  const handleLocationChange = (e) => setSelectedLocation(e.target.value);

  const handleToggleAttendance = (shiftId) => {
    setAttendance((prev) => ({
      ...prev,
      [shiftId]: !prev[shiftId],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const filteredVolunteers = volunteers.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredShifts = assignedShifts.filter(
    s => s.date === selectedDate && (!selectedLocation || s.location === selectedLocation)
  );

  const renderVolunteers = () => (
    <section className="volunteers-section">
      <h1>Volunteers Management</h1>
      <input type="text" placeholder="Search by name" value={searchQuery} onChange={handleSearchChange} className="search-bar" />
      <div className="volunteer-list">
        {filteredVolunteers.map(v => (
          <div key={v.id} className="volunteer-item">
            <img src={v.profilePicture} alt={v.name} className="volunteer-img" />
            <div className="volunteer-details">
              <p><strong>Name:</strong> {v.name}</p>
              <p><strong>Email:</strong> {v.email}</p>
              <p><strong>Contact:</strong> {v.contact}</p>
              <p><strong>Categories:</strong> {v.categories.join(', ')}</p>
              <p><strong>Hours Volunteered:</strong> {v.hours} hrs</p>
            </div>
            <button onClick={() => handleDelete(v.id)} className="delete-btn">Delete</button>
          </div>
        ))}
      </div>
    </section>
  );

  const renderAssignedShifts = () => (
    <section className="assigned-shifts-section">
      <h1>Assigned Shifts</h1>
      <label><strong>Select Date:</strong></label>
      <select value={selectedDate} onChange={handleDateChange} className="date-dropdown">
        <option value="">Select a date</option>
        {dates.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      {selectedDate && (
        <>
          <label><strong>Select Location:</strong></label>
          <select value={selectedLocation} onChange={handleLocationChange} className="location-dropdown">
            <option value="">All locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </>
      )}

      <div className="assigned-shifts-list">
        {filteredShifts.length > 0 ? (
          filteredShifts.map(shift => {
            const volunteer = volunteers.find(v => v.id === shift.volunteerId);
            return (
              <div key={shift.id} className="shift-item-admin">
                <p><strong>Volunteer:</strong> {volunteer?.name || 'Unknown'}</p>
                <p><strong>Time:</strong> {shift.time}</p>
                <p><strong>Location:</strong> {shift.location}</p>
                <p><strong>Task:</strong> {shift.task}</p>

                <label>
                  <input
                    type="checkbox"
                    checked={attendance[shift.id] || false}
                    onChange={() => handleToggleAttendance(shift.id)}
                  />
                  {' '}Mark as Attended
                </label>

                <button onClick={() => handleCancelShift(shift.id)} className="cancel-btn">Cancel Shift</button>
              </div>
            );
          })
        ) : (
          <p>No shifts assigned for this date.</p>
        )}
      </div>
    </section>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Volunteers': return renderVolunteers();
      case 'Assigned Shifts': return renderAssignedShifts();
      case 'Available Shifts': return <div><h1>Available Shifts</h1></div>;
      case 'Feedback': return <div><h1>Feedback</h1></div>;
      case 'Statistics': return <Statistics />;
      case 'Event Publishing': return <EventForm />; // Optional if added
      default: return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          {['Volunteers', 'Assigned Shifts', 'Available Shifts', 'Feedback', 'Statistics', 'Event Publishing'].map(tab => (
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
