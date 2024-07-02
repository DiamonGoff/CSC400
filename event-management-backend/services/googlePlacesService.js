const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

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
  searchPlaces,
};
