const express = require('express');
const axios = require('axios');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, async (req, res) => {
  const { origin, destination, mode } = req.query;

  if (!origin || !destination || !mode) {
    return res.status(400).json({ error: 'Origin, destination, and mode are required' });
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        mode,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Google Maps API:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data from Google Maps API' });
  }
});

module.exports = router;
