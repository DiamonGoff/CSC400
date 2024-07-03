require('dotenv').config(); // Add this line at the top of the file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const eventRoutes = require('./routes/event');
const authRoutes = require('./routes/auth'); // Add this line

const app = express();
const port = 3001; // Use a different port if 3000 is in use by the frontend

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Use the event and auth routes
app.use('/', eventRoutes);
app.use('/auth', authRoutes); // Add this line

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
