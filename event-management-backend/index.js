// index.js or server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3001;

// Middleware setup
app.use(cors({
  origin: 'http://127.0.0.1:3000',
  credentials: true,
}));
app.use(bodyParser.json());
<<<<<<< HEAD
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
=======
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use secure: true in production
}));

// Import routes
const authRoutes = require('./routes/auth');
// other routes...

// Use routes
app.use('/auth', authRoutes);
// other routes...

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch((error) => {
  console.error('Connection error', error.message);
});
>>>>>>> 123ae86bc8913d2bbf5a57f14d21b19963103560
