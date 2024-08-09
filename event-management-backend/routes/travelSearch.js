const express = require('express');
const axios = require('axios');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); // Middleware to verify JWT token

// Setup Winston for better logging
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`) // Customize log format
  ),
  transports: [
    new winston.transports.Console() // Log to the console
  ]
});

// Route to fetch nearby places based on location and type
router.get('/', verifyToken, async (req, res) => {
  const { location, type } = req.query; // Extract location and type from query parameters

  // Check if location and type are provided
  if (!location || !type) {
    logger.error('Location and type are required'); // Log error if missing
    return res.status(400).json({ error: 'Location and type are required' }); // Respond with 400 Bad Request
  }

  try {
    logger.info(`Fetching ${type} options for location: ${location}`); // Log the request info
    const placesResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location,
        radius: type === 'lodging' ? 10000 : 5000, // Set radius: 10km for lodging, 5km for other types
        type,
        key: process.env.GOOGLE_PLACES_API_KEY, // Use API key from environment variables
      },
    });

    logger.info(`${type} options fetched successfully`); // Log success

    // Respond with the relevant place information
    res.json({
      results: placesResponse.data.results.map(place => ({
        name: place.name, // Place name
        vicinity: place.vicinity, // Place vicinity
      })),
    });
  } catch (error) {
    // Log any errors, with detailed message if available
    logger.error(`Error fetching data from Google Places API: ${error.response ? error.response.data : error.message}`);
    res.status(500).json({ error: 'An error occurred while fetching data from Google Places API' }); // Respond with 500 Internal Server Error
  }
});

module.exports = router; // Export the router
