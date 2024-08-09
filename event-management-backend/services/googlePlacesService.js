const { Client } = require("@googlemaps/google-maps-services-js");

// Initialize Google Maps API client
const client = new Client({});

// Google Maps API key from environment variables
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Function to search for places based on a query
const searchPlaces = async (query) => {
  try {
    // Send a text search request to the Google Maps Places API
    const response = await client.textSearch({
      params: {
        query: query, // The search query (e.g., "restaurants in New York")
        key: API_KEY, // Google Maps API key
      },
      timeout: 1000, // Request timeout in milliseconds
    });

    return response.data.results; // Return the search results
  } catch (error) {
    console.error(error); // Log any errors that occur
    throw new Error("Failed to fetch places"); // Throw an error to be handled by the caller
  }
};

module.exports = {
  searchPlaces, // Export the searchPlaces function
};
