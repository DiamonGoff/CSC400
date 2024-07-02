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
  location: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  guests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest'
  }]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
