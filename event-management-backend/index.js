const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const guestRoutes = require('./routes/guest');
const taskRoutes = require('./routes/task');
const venueRoutes = require('./routes/venues');
const travelSearchRoutes = require('./routes/travelSearch');

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/guests', guestRoutes);
app.use('/tasks', taskRoutes);
app.use('/venues', venueRoutes);
app.use('/travelSearch', travelSearchRoutes);
// Connect to MongoDB
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
