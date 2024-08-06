const express = require('express');
const axios = require('axios');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); // Use the new middleware

// Use winston for better logging (optional)
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console()
  ]
});

router.get('/', verifyToken, async (req, res) => {
  const { location, type } = req.query;

  if (!location || !type) {
    logger.error('Location and type are required');
    return res.status(400).json({ error: 'Location and type are required' });
  }

  try {
    logger.info(`Fetching ${type} options for location: ${location}`);
    const placesResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location,
        radius: type === 'lodging' ? 10000 : 5000, // 10km radius for lodging, 5km for transportation
        type,
        key: process.env.GOOGLE_PLACES_API_KEY,
      },
    });

    logger.info(`${type} options fetched successfully`);

    res.json({
      results: placesResponse.data.results.map(place => ({
        name: place.name,
        vicinity: place.vicinity,
      })),
    });
  } catch (error) {
    logger.error(`Error fetching data from Google Places API: ${error.response ? error.response.data : error.message}`);
    res.status(500).json({ error: 'An error occurred while fetching data from Google Places API' });
  }
});

module.exports = router;
