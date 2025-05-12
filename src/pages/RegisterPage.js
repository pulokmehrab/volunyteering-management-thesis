import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const API_URL = 'http://localhost:5000/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    contact: '',
    categories: [],
    role: 'volunteer',
    profilePicture: ''
  });
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const navigate = useNavigate();

  const categoryOptions = [
    'Hostess',
    'Shop',
    'Bar/Service',
    'Accreditation',
    'Cloakroom',
    'Technical Support'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2000000) {
        setError('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
        setFormData(prev => ({
          ...prev,
          profilePicture: base64String
        }));
        setError(''); // Clear any previous errors
      };
      reader.onerror = () => {
        setError('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.categories.length) {
      setError('Please select at least one category');
      return;
    }

    try {
      // Create a copy of formData with potentially smaller image
      const submitData = { ...formData };
      
      // If image is too large, use a default image
      if (submitData.profilePicture && submitData.profilePicture.length > 2000000) {
        submitData.profilePicture = 'https://via.placeholder.com/150';
      }

      console.log('Attempting registration with data:', {
        ...submitData,
        profilePicture: submitData.profilePicture ? 'TRUNCATED' : null
      });
      
      const response = await axios.post(`${API_URL}/auth/register`, submitData);
      console.log('Registration response:', response);

      if (response.status === 201) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error details:', {
        response: error.response,
        message: error.message,
        stack: error.stack
      });
      
      if (error.response?.data?.error) {
        setError(`Registration failed: ${error.response.data.error}`);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(`Error: ${error.message}`);
      } else {
        setError('Failed to register. Please check your network connection and try again.');
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="profile-picture-section">
            <div className="profile-picture-container">
              <img 
                src={previewImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSweN5K2yaBwZpz5W9CxY9S41DI-2LawmjzYw&s'} 
                alt="Profile Preview" 
                className="profile-picture-preview"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="profile-picture-input"
                id="profile-picture"
              />
              <label htmlFor="profile-picture" className="profile-picture-label">
                Choose Photo
              </label>
            </div>
            {error && <p className="profile-picture-error">{error}</p>}
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            className="register-input"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="register-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="register-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="register-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            className="register-input"
            value={formData.contact}
            onChange={handleChange}
            required
          />
          
          <div className="categories-section">
            <label>Select Categories:</label>
            <div className="categories-grid">
              {categoryOptions.map(category => (
                <label key={category} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <select
            name="role"
            className="register-select"
            value={formData.role}
            onChange={handleChange}
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
