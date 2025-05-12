const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET = 'your_jwt_secret_key';

// Validation middleware
const validateRegistration = (req, res, next) => {
  const { username, password, role, name, email, contact } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters long' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  if (role === 'volunteer') {
    if (!name || !email || !contact) {
      return res.status(400).json({ message: 'Name, email, and contact are required for volunteers' });
    }
  }

  next();
};

// Register route
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { username, password, role, name, email, contact, categories, profilePicture } = req.body;

    console.log('Registration attempt for:', { username, role, email });

    // Check if user exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if email exists
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      username,
      password: hashedPassword,
      role: role || 'volunteer',
      name,
      email,
      contact,
      categories: categories || [],
      profilePicture: profilePicture || 'https://via.placeholder.com/150'
    };

    // Create new user
    const user = await User.create(userData);
    console.log('User created successfully:', user.username);

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: user._id 
    });

  } catch (error) {
    console.error('Registration error:', {
      message: error.message,
      stack: error.stack
    });

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }

    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and send token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { authRouter: router, verifyToken };
