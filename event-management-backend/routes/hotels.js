const express = require('express');
const router = express.Router();
const axios = require('axios');

// Helper function to calculate the distance between two points in miles
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in miles
  return distance;
};

// Helper function to get place details
const getPlaceDetails = async (placeId) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website,rating,vicinity&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const response = await axios.get(url);
  return response.data.result;
};

// Route to fetch hotels
router.get('/', async (req, res) => {
  const { lat, lng } = req.query;
  console.log(`Received request for hotels at lat: ${lat}, lng: ${lng}`); // Log incoming request

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: 150000,
        type: 'lodging',
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    const places = response.data.results;
    console.log('Hotels fetched from Google Places API:', places); // Log the response data

    // Fetch details for each place and calculate the distance
    const detailedPlaces = await Promise.all(places.map(async (place) => {
      const details = await getPlaceDetails(place.place_id);
      const distance = calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng);
      return {
        name: place.name,
        vicinity: place.vicinity,
        rating: place.rating,
        phone: details.formatted_phone_number,
        website: details.website,
        isFavorite: false, // Add any additional fields you need
        place_id: place.place_id,
        distance // Include the distance
      };
    }));

    res.json(detailedPlaces);
  } catch (error) {
    console.error('Error fetching hotel data:', error); // Log the error
    res.status(500).send('Error fetching hotel data');
  }
});

module.exports = router;
