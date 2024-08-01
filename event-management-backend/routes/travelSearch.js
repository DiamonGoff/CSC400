const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }

  try {
    const transportationResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location,
        radius: 5000, // 5km radius for transportation
        type: 'bus_station|subway_station|train_station',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const lodgingResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location,
        radius: 10000, // 10km radius for lodging
        type: 'lodging',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    res.json({
      transportation: transportationResponse.data.results,
      lodging: lodgingResponse.data.results,
    });
  } catch (error) {
    console.error('Error fetching data from Google Places API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while fetching data from Google Places API' });
  }
});

module.exports = router;
