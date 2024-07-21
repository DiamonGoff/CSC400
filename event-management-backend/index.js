const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001; // Ensure this line sets the default port to 3001

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Add this line

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event'); // Adjust path if necessary
const guestRoutes = require('./routes/guest'); // Adjust path if necessary
const taskRoutes = require('./routes/task');
const venueRoutes = require('./routes/venues');

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/guests', guestRoutes); // Ensure this line is correct
app.use('/tasks', taskRoutes);
app.use('/venues', venueRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});
