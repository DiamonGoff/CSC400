const express = require('express');
const axios = require('axios');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Route to get directions between origin and destination using Google Directions API
router.get('/directions', verifyToken, async (req, res) => {
  const { origin, destination } = req.query; // Extract origin and destination from query parameters

  // Check if both origin and destination are provided
  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination are required' }); // Respond with 400 Bad Request if missing
  }

  try {
    // Make a request to the Google Maps Directions API
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        key: process.env.GOOGLE_MAPS_API_KEY, // Use API key from environment variables
      },
    });

    res.json(response.data); // Respond with the directions data from the API
  } catch (error) {
    console.error('Error fetching data from Google Directions API:', error.message); // Log any errors
    res.status(500).json({ error: 'An error occurred while fetching data from Google Directions API' }); // Respond with 500 Internal Server Error if there's an issue
  }
});

module.exports = router; // Export the router
