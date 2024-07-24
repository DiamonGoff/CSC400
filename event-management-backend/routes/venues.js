const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const authenticate = require('../middleware/authenticate');
const { geocodeAddress, searchPlaces } = require('../services/googleMapsServices');

// Get all venues for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const venues = await Venue.find({ userId: req.user._id });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new venue
router.post('/', authenticate, async (req, res) => {
  try {
    const { address, name, capacity, amenities, price, userId } = req.body;
    const geocodeResult = await geocodeAddress(address);
    if (geocodeResult.status !== 'OK') {
      return res.status(400).json({ message: 'Invalid address' });
    }
    const location = geocodeResult.results[0].geometry.location;
    const venue = new Venue({
      name,
      address,
      capacity,
      amenities,
      price,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      },
      userId: req.user._id
    });
    const newVenue = await venue.save();
    res.status(201).json(newVenue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a venue
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { address, name, capacity, amenities, price } = req.body;
    const venue = await Venue.findOne({ _id: req.params.id, userId: req.user._id });
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    if (address) {
      const geocodeResult = await geocodeAddress(address);
      if (geocodeResult.status !== 'OK') {
        return res.status(400).json({ message: 'Invalid address' });
      }
      const location = geocodeResult.results[0].geometry.location;
      venue.location = {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      };
    }
    Object.assign(venue, { name, capacity, amenities, price });
    await venue.save();
    res.json(venue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a venue
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const venue = await Venue.findOne({ _id: req.params.id, userId: req.user._id });
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    await venue.remove();
    res.json({ message: 'Venue deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Venue search route
router.get('/search', authenticate, async (req, res) => {
  const { location, capacity, amenities, budget } = req.query;

  try {
    const query = {
      userId: req.user._id,
      capacity: { $gte: capacity },
      price: { $lte: budget },
      amenities: { $all: amenities.split(',') }
    };

    if (location) {
      const geocodeResult = await geocodeAddress(location);
      if (geocodeResult.status !== 'OK') {
        return res.status(400).json({ message: 'Invalid address' });
      }
      const loc = geocodeResult.results[0].geometry.location;
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [loc.lng, loc.lat]
          },
          $maxDistance: 50000 // Search within 50km radius
        }
      };
    }

    const venues = await Venue.find(query);
    res.json(venues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
