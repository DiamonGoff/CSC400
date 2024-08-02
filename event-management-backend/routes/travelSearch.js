const express = require('express');
const axios = require('axios');
const router = express.Router();

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

router.get('/', async (req, res) => {
  const { location } = req.query;

  if (!location) {
    logger.error('Location is required');
    return res.status(400).json({ error: 'Location is required' });
  }

  try {
    logger.info(`Fetching transportation options for location: ${location}`);
    const transportationResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location,
        radius: 5000, // 5km radius for transportation
        type: 'bus_station|subway_station|train_station',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    logger.info(`Transportation options fetched successfully`);

    logger.info(`Fetching lodging options for location: ${location}`);
    const lodgingResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location,
        radius: 10000, // 10km radius for lodging
        type: 'lodging',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    logger.info(`Lodging options fetched successfully`);

    res.json({
      transportation: transportationResponse.data.results,
      lodging: lodgingResponse.data.results,
    });
  } catch (error) {
    logger.error(`Error fetching data from Google Places API: ${error.response ? error.response.data : error.message}`);
    res.status(500).json({ error: 'An error occurred while fetching data from Google Places API' });
  }
});

module.exports = router;
