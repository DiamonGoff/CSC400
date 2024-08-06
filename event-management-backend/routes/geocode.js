const express = require('express');
const axios = require('axios');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const location = response.data.results[0].geometry.location;
    res.json(location);
  } catch (error) {
    console.error('Error fetching data from Google Maps API:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching data from Google Maps API' });
  }
});

module.exports = router;
