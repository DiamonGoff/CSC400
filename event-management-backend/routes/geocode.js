const express = require('express');
const axios = require('axios');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Route to get the geocoded location (latitude and longitude) for a given address
router.get('/', verifyToken, async (req, res) => {
  const { address } = req.query; // Extract address from query parameters

  // Check if the address parameter is provided
  if (!address) {
    return res.status(400).json({ error: 'Address is required' }); // Respond with 400 Bad Request if address is missing
  }

  try {
    // Make a request to the Google Maps Geocoding API
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY, // Use API key from environment variables
      },
    });

    const location = response.data.results[0].geometry.location; // Extract the latitude and longitude from the API response
    res.json(location); // Respond with the location data
  } catch (error) {
    console.error('Error fetching data from Google Maps API:', error.message); // Log any errors
    res.status(500).json({ error: 'An error occurred while fetching data from Google Maps API' }); // Respond with 500 Internal Server Error if there's an issue
  }
});

module.exports = router; // Export the router
