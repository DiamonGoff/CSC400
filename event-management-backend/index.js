require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport'); // Import passport configuration

const app = express();
const port = process.env.PORT || 3001;

// Middleware setup
const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin (e.g., mobile apps or curl requests)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors()); // Allow preflight requests for all routes

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
const geocodeRouter = require('./routes/geocode');
const travelRoutes = require('./routes/travel');
const directionsRoute = require('./routes/directions');
const hotelsRoute = require('./routes/hotels');
const travelModesRoute = require('./routes/travelModes');
const giftSuggestionsRouter = require('./routes/giftSuggestions'); // Import the gift suggestions route

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
app.use('/geocode', geocodeRouter);
app.use('/travel', travelRoutes);
app.use('/api/directions', directionsRoute);
app.use('/api/hotels', hotelsRoute);
app.use('/api/travelModes', travelModesRoute);
app.use('/gift-suggestions', giftSuggestionsRouter); // Use the gift suggestions route

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
