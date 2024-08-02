require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const passport = require('./config/passport'); // Import passport configuration

dotenv.config(); // Ensure this is at the top

const app = express();
const port = process.env.PORT || 3001;

// Middleware setup
app.use(cors({
  origin: 'http://127.0.0.1:3000',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));
app.use(passport.initialize());
app.use(passport.session());

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const guestRoutes = require('./routes/guest');
const taskRoutes = require('./routes/task');
const venueRoutes = require('./routes/venues');
const travelSearchRoutes = require('./routes/travelSearch');
const favoriteRoutes = require('./routes/favorites');
const notificationRoutes = require('./routes/notifications');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/user');

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
app.use('/favorites', favoriteRoutes);
app.use('/notifications', notificationRoutes);
app.use('/profile', profileRoutes);
app.use('/users', userRoutes);

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
