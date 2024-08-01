require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add CORS middleware

// Import routes
const eventRoutes = require('./routes/event');
const authRoutes = require('./routes/auth');
const guestRoutes = require('./routes/guest'); // Guest routes
const venuesRoutes = require('./routes/venues'); // Venues routes
const favoritesRoutes = require('./routes/favorites'); // Favorites routes
const travelSearchRoutes = require('./routes/travelSearch'); // Travel search routes

const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Use CORS

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after a successful database connection
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Use the routes
app.use('/events', eventRoutes);
app.use('/auth', authRoutes);
app.use('/guests', guestRoutes); // Use guest routes
app.use('/venues', venuesRoutes); // Use venues routes
app.use('/favorites', favoritesRoutes); // Use favorites routes
app.use('/travelSearch', travelSearchRoutes); // Use travel search routes
