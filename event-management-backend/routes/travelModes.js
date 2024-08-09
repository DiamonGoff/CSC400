const express = require('express');
const axios = require('axios');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Function to fetch directions from Google Directions API based on origin, destination, and travel mode
const fetchDirections = async (origin, destination, mode) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        mode,
        key: process.env.GOOGLE_MAPS_API_KEY, // Use API key from environment variables
      },
    });
    return response.data; // Return the directions data from the API response
  } catch (error) {
    throw new Error('Error fetching data from Google Directions API'); // Throw error if API request fails
  }
};

// Route to get directions with specified travel mode
router.get('/directions', verifyToken, async (req, res) => {
  const { origin, destination, mode } = req.query; // Extract origin, destination, and mode from query parameters

  // Check if origin, destination, and mode are provided
  if (!origin || !destination || !mode) {
    return res.status(400).json({ error: 'Origin, destination, and mode are required' }); // Respond with 400 Bad Request if any are missing
  }

  try {
    console.log(`Origin: ${origin}, Destination: ${destination}, Mode: ${mode}`); // Log the parameters for debugging
    const directions = await fetchDirections(origin, destination, mode.toLowerCase()); // Fetch directions, ensuring mode is in lowercase
    res.json(directions); // Respond with the fetched directions data
  } catch (error) {
    console.error('Error fetching data from Google Directions API:', error.message); // Log any errors
    res.status(500).json({ error: 'An error occurred while fetching data from Google Directions API' }); // Respond with 500 Internal Server Error if there's an issue
  }
});

module.exports = router; // Export the router
