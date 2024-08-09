const mongoose = require('mongoose');

// Define schema for storing guest information for an event
const guestSchema = new mongoose.Schema({
  name: {
    type: String, // Guest's name
    required: true
  },
  email: {
    type: String, // Guest's email, must be unique
    required: true,
    unique: true
  },
  rsvp: {
    type: Boolean, // RSVP status (true for attending, false for not attending)
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the associated Event
    ref: 'Event',
    required: true
  }
});

// Create Guest model from schema
const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest; // Export Guest model
