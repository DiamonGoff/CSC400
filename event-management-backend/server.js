// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const eventRoutes = require('./routes/event');
const guestRoutes = require('./routes/guest'); // Import the guest routes

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/event-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Use the routes
app.use('/', eventRoutes);
app.use('/', guestRoutes); // Use the guest routes

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
