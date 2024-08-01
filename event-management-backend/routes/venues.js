const express = require('express');
const router = express.Router();
const axios = require('axios');

const amenitiesMapping = {
  'wifi': 'WiFi',
  'parking': 'Parking',
  'restroom': 'Restrooms',
  'av_equipment': 'AV Equipment (Audio/Visual)',
  'stage': 'Stage',
  'dance_floor': 'Dance Floor',
  'outdoor_area': 'Outdoor Area',
  'catering': 'Catering Services',
  'bar': 'Bar Services',
  'tables_and_chairs': 'Tables and Chairs',
  'linens': 'Linens',
  'decorations': 'Decorations',
  'lighting': 'Lighting',
  'dj': 'DJ or Live Music',
  'photo_booth': 'Photo Booth',
  'projector_and_screen': 'Projector and Screen',
  'private_room': 'Private Rooms',
  'kids_play_area': 'Kids Play Area',
  'air_conditioning': 'Air Conditioning/Heating',
  'accessible': 'Accessible Facilities (Wheelchair Access)',
  'coat_check': 'Coat Check',
  'security': 'Security Services',
  'sound_system': 'Sound System',
  'games_and_entertainment': 'Games and Entertainment',
  'pet_friendly': 'Pet-Friendly',
  'swimming_pool': 'Swimming Pool',
  'spa_services': 'Spa Services',
  'backup_power': 'Backup Power Supply',
  'fireplace': 'Fireplace',
  'smoking_area': 'Smoking Area',
  'food': 'Food'
};

// Helper function to get detailed place information
async function getPlaceDetails(placeId) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    const result = response.data.result;

    // Map place types to amenities
    const mappedAmenities = result.types.map(type => {
      const key = type.replace(/_/g, '');
      return amenitiesMapping[key] || type;
    });

    return {
      name: result.name,
      address: result.formatted_address,
      phone: result.formatted_phone_number || 'N/A',
      website: result.website || 'N/A',
      amenities: mappedAmenities,
      capacity: result.user_ratings_total || 'N/A', // Use user ratings total as a proxy for capacity
      price: result.price_level || 'N/A' // Use price level from the API
    };
  } catch (error) {
    console.error('There was an error getting place details!', error);
    return null;
  }
}

// Route to search for venues
router.get('/search', async (req, res) => {
  const { location, capacity, amenities, budget } = req.query;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: `venues in ${location}`,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    const places = response.data.results;
    const venuePromises = places.map(async (place) => {
      const details = await getPlaceDetails(place.place_id);
      return {
        name: details.name,
        address: details.address,
        phone: details.phone,
        website: details.website,
        amenities: details.amenities,
        capacity: details.capacity,
        price: details.price
      };
    });

    const venues = await Promise.all(venuePromises);
    console.log('Final Venue List:', venues); // Debugging: Log the final list of venues
    res.json(venues);
  } catch (error) {
    console.error('There was an error searching for venues!', error);
    res.status(500).json({ message: 'There was an error searching for venues!' });
  }
});

module.exports = router;
