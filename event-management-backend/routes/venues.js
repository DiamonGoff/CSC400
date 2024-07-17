const express = require('express');
const router = express.Router();
const axios = require('axios');

// Helper function to get detailed place information
async function getPlaceDetails(placeId) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    return response.data.result;
  } catch (error) {
    console.error('There was an error getting place details!', error);
    return null;
  }
}

// Route to search for venues
router.get('/search', async (req, res) => {
  const { location, capacity, amenities, budget } = req.query;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: `venues in ${location}`,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    const places = response.data.results;
    const venuePromises = places.map(async (place) => {
      const details = await getPlaceDetails(place.place_id);
      return {
        name: place.name,
        address: place.formatted_address,
        capacity: capacity || 'N/A',
        amenities: amenities ? amenities.split(',') : [],
        price: budget || 'N/A'
      };
    });

    const venues = await Promise.all(venuePromises);
    res.json(venues);
  } catch (error) {
    console.error('There was an error searching for venues!', error);
    res.status(500).json({ message: 'There was an error searching for venues!' });
  }
});

// Route to book a venue
router.post('/book', async (req, res) => {
  const { venueId } = req.body;
  // Here you would implement the logic to book a venue (e.g., storing booking details in your database)
  res.json({ message: 'Venue booked successfully!' });
});

module.exports = router;
