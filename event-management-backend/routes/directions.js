const express = require('express');
const axios = require('axios');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Route to get directions using Google Maps API
router.get('/', verifyToken, async (req, res) => {
  const { origin, destination, mode } = req.query; // Extract origin, destination, and mode from query parameters

  // Check if all required parameters are provided
  if (!origin || !destination || !mode) {
    return res.status(400).json({ error: 'Origin, destination, and mode are required' }); // Respond with 400 Bad Request if any are missing
  }

  try {
    // Make a request to the Google Maps Directions API
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        mode,
        key: process.env.GOOGLE_MAPS_API_KEY, // Use API key from environment variables
      },
    });

    res.json(response.data); // Respond with the data from the Google Maps API
  } catch (error) {
    console.error('Error fetching data from Google Maps API:', error.message); // Log any errors
    res.status(500).json({ error: 'An error occurred while fetching data from Google Maps API' }); // Respond with 500 Internal Server Error if there's an issue
  }
});

module.exports = router; // Export the router
