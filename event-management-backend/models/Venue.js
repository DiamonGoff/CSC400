const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
    name: String,
    address: String,
    capacity: Number,
    amenities: [String],
    price: Number,
    location: {
        type: { type: String },
        coordinates: [Number]
    }
});

VenueSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Venue', VenueSchema);
