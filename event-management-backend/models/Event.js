const mongoose = require('mongoose');

// Define RSVP schema for tracking attendee responses
const rsvpSchema = new mongoose.Schema({
  attendeeId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User',
    required: true
  },
  attendeeName: {
    type: String,
    required: true
  },
  attendeeEmail: {
    type: String,
    required: true
  },
  response: {
    type: String,
    enum: ['yes', 'no', 'maybe'], // Allowed responses
    default: 'yes'
  }
});

// Define Event schema for storing event details
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    name: { type: String, required: true }, // Venue name
    lat: { type: Number, required: true },  // Latitude
    lng: { type: Number, required: true }   // Longitude
  },
  description: {
    type: String,
    required: true
  },
  guestList: {
    type: [String], // Array of guest emails
    default: []
  },
  specialRequirements: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User',
    required: true
  },
  rsvps: {
    type: [rsvpSchema], // Array of RSVP objects
    default: []
  }
});

// Create Event model from schema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event; // Export Event model
