require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const eventRoutes = require('./routes/event');
const authRoutes = require('./routes/auth');
const guestRoutes = require('./routes/guest');
const venuesRoutes = require('./routes/venues');

const app = express();
const port = 3001; // Use a different port if 3000 is in use by the frontend

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Use the routes
app.use('/events', eventRoutes);
app.use('/auth', authRoutes);
app.use('/guests', guestRoutes);
app.use('/venues', venuesRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
