const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  attendeeId: {
    type: mongoose.Schema.Types.ObjectId,
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
    enum: ['yes', 'no', 'maybe'],
    default: 'yes'
  }
});

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
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    required: true
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rsvps: {
    type: [rsvpSchema],
    default: []
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
