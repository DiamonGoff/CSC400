const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: String,
  address: String,
<<<<<<< HEAD
  phone: String,
  website: String,
  amenities: [String],
  capacity: Number,
  price: Number,
=======
  capacity: Number,
  amenities: [String],
  price: Number,
  location: {
    type: { type: String },
    coordinates: [Number]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
>>>>>>> 123ae86bc8913d2bbf5a57f14d21b19963103560
});

module.exports = mongoose.model('Venue', VenueSchema);
