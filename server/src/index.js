// express server setup
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// import routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());
app.use(express.json());

//  test route
app.get('/', (req, res) => {
  res.json({ message: 'tripbooking api working' });
});

// routes will go here
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// auth routes
app.use('/api/auth', authRoutes);

// booking routes
app.use('/api/bookings', bookingRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`server at http://localhost:${PORT}`);
  console.log(`api at http://localhost:${PORT}/api/health`);
});
