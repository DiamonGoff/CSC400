const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  website: String,
  amenities: [String],
  capacity: Number,
  price: Number,
});

module.exports = mongoose.model('Venue', VenueSchema);
