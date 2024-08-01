const axios = require('axios');

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const geocodeAddress = async (address) => {
  const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: address,
      key: API_KEY
    }
  });
  return response.data;
};

const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});

const searchPlaces = async (query) => {
  try {
    const response = await client.textSearch({
      params: {
        query: query,
        key: API_KEY,
      },
      timeout: 1000, // milliseconds
    });
    return response.data.results;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch places");
  }
};

module.exports = {
  geocodeAddress,
  searchPlaces,
};
