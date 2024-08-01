const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const authenticate = require('../middleware/authenticate');
const { geocodeAddress, searchPlaces } = require('../services/googleMapsServices');

<<<<<<< HEAD
const amenitiesMapping = {
  'wifi': 'WiFi',
  'parking': 'Parking',
  'restroom': 'Restrooms',
  'av_equipment': 'AV Equipment (Audio/Visual)',
  'stage': 'Stage',
  'dance_floor': 'Dance Floor',
  'outdoor_area': 'Outdoor Area',
  'catering': 'Catering Services',
  'bar': 'Bar Services',
  'tables_and_chairs': 'Tables and Chairs',
  'linens': 'Linens',
  'decorations': 'Decorations',
  'lighting': 'Lighting',
  'dj': 'DJ or Live Music',
  'photo_booth': 'Photo Booth',
  'projector_and_screen': 'Projector and Screen',
  'private_room': 'Private Rooms',
  'kids_play_area': 'Kids Play Area',
  'air_conditioning': 'Air Conditioning/Heating',
  'accessible': 'Accessible Facilities (Wheelchair Access)',
  'coat_check': 'Coat Check',
  'security': 'Security Services',
  'sound_system': 'Sound System',
  'games_and_entertainment': 'Games and Entertainment',
  'pet_friendly': 'Pet-Friendly',
  'swimming_pool': 'Swimming Pool',
  'spa_services': 'Spa Services',
  'backup_power': 'Backup Power Supply',
  'fireplace': 'Fireplace',
  'smoking_area': 'Smoking Area',
  'food': 'Food'
};

// Helper function to get detailed place information
async function getPlaceDetails(placeId) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    const result = response.data.result;

    // Map place types to amenities
    const mappedAmenities = result.types.map(type => {
      const key = type.replace(/_/g, '');
      return amenitiesMapping[key] || type;
    });

    return {
      name: result.name,
      address: result.formatted_address,
      phone: result.formatted_phone_number || 'N/A',
      website: result.website || 'N/A',
      amenities: mappedAmenities,
      capacity: result.user_ratings_total || 'N/A', // Use user ratings total as a proxy for capacity
      price: result.price_level || 'N/A' // Use price level from the API
    };
=======
// Get all venues for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const venues = await Venue.find({ userId: req.user._id });
    res.json(venues);
>>>>>>> 123ae86bc8913d2bbf5a57f14d21b19963103560
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
<<<<<<< HEAD
    });

    const places = response.data.results;
    const venuePromises = places.map(async (place) => {
      const details = await getPlaceDetails(place.place_id);
      return {
        name: details.name,
        address: details.address,
        phone: details.phone,
        website: details.website,
        amenities: details.amenities,
        capacity: details.capacity,
        price: details.price
=======
      const loc = geocodeResult.results[0].geometry.location;
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [loc.lng, loc.lat]
          },
          $maxDistance: 50000 // Search within 50km radius
        }
>>>>>>> 123ae86bc8913d2bbf5a57f14d21b19963103560
      };
    }

<<<<<<< HEAD
    const venues = await Promise.all(venuePromises);
    console.log('Final Venue List:', venues); // Debugging: Log the final list of venues
=======
    const venues = await Venue.find(query);
>>>>>>> 123ae86bc8913d2bbf5a57f14d21b19963103560
    res.json(venues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
