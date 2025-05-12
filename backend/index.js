const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { authRouter } = require('./routes/auth');
const shiftsRoute = require('./routes/shifts');  // Import the shifts route
const usersRoute = require('./routes/users');
const eventsRoute = require('./routes/events');
const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());  // To parse JSON bodies

// Routes
app.use('/api/auth', authRouter);  // Auth routes
app.use('/api/shifts', shiftsRoute);  // Shifts routes
app.use('/api/users', usersRoute);
app.use('/api/events', eventsRoute);


app.get('/', (req, res)=>{
  res.send("Server is running!")
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    details: err
  });
  
  res.status(500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});