const express = require('express');
const axios = require('axios');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Function to fetch directions based on travel mode
const fetchDirections = async (origin, destination, mode) => {
  const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
    params: {
      origin,
      destination,
      mode,
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });
  return response.data;
};

router.get('/directions', verifyToken, async (req, res) => {
  const { origin, destination, mode } = req.query;

  if (!origin || !destination || !mode) {
    return res.status(400).json({ error: 'Origin, destination, and mode are required' });
  }

  try {
    console.log(`Origin: ${origin}, Destination: ${destination}, Mode: ${mode}`); // Log the parameters
    const directions = await fetchDirections(origin, destination, mode.toUpperCase());
    res.json(directions);
  } catch (error) {
    console.error('Error fetching data from Google Directions API:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data from Google Directions API' });
  }
});

module.exports = router;
