require('dotenv').config(); // Add this line at the top of the file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const eventRoutes = require('./routes/event');

const app = express();
const port = 3001; // Use a different port if 3000 is in use by the frontend

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/event-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Use the event routes
app.use('/', eventRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
