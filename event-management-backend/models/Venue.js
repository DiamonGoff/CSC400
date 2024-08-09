const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for venues
const venueSchema = new Schema({
  name: {
    type: String, // Venue name
    required: true,
  },
  address: String, // Venue address (optional)
  capacity: Number, // Venue capacity (optional)
  // Add any other fields you need for the venue
});

// Create Venue model from schema
const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue; // Export Venue model
