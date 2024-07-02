// services/googleMapsService.js
const axios = require('axios');

// Directly using the API key (less secure, not recommended for production)
const API_KEY = 'AIzaSyCdfPG7y833BQqWvyonh6VZlAoRWfD6uGo';

const geocodeAddress = async (address) => {
  const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: address,
      key: API_KEY
    }
  });
  return response.data;
};

module.exports = {
  geocodeAddress
};
