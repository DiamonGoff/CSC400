const mongoose = require('mongoose');

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
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  guestList: {
    type: [String], // Assuming an array of guest emails or phone numbers
    default: []
  },
  specialRequirements: {
    type: String,
    default: ''
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;