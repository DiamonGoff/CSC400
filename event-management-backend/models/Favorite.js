const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  userId: String, // Assuming user management is implemented
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
