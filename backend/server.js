const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { authRouter } = require('./routes/auth');
const shiftsRouter = require('./routes/shifts');
const donationsRouter = require('./routes/donations');
const eventsRouter = require('./routes/events');
const usersRouter = require('./routes/users');
const feedbackRouter = require('./routes/feedback');  // <-- Add this

const app = express();

// Connect to database
connectDB();

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/shifts', shiftsRouter);
app.use('/api/donations', donationsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);
app.use('/api/feedback', feedbackRouter);   // <-- Add this

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API endpoints available:');
  console.log('- Auth: /api/auth');
  console.log('- Shifts: /api/shifts');
  console.log('- Donations: /api/donations');
  console.log('- Events: /api/events');
  console.log('- Users: /api/users');
  console.log('- Feedback: /api/feedback');  // Optional: add this for clarity
});
