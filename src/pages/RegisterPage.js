import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('volunteer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://react-volunteer-management-system-backend.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Username"
            className="register-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="register-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="volunteer">Volunteer</option>
            <option value="organizer">Organizer</option>
          </select>
          <button type="submit" className="register-btn">Register</button>
        </form>
        {error && <p className="register-error">{error}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;
