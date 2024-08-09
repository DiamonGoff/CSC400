const mongoose = require('mongoose');

// Define schema for storing user favorite venues
const FavoriteSchema = new mongoose.Schema({
  userId: String, // Store the user's ID (assumes user management is in place)
  venue: { 
    type: mongoose.Schema.Types.ObjectId, // Reference to the Venue model
    ref: 'Venue' 
  }
});

// Export the Favorite model based on the schema
module.exports = mongoose.model('Favorite', FavoriteSchema);
