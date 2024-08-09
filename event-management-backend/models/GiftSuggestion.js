const mongoose = require('mongoose');

// Define schema for gift suggestions related to events
const giftSuggestionSchema = new mongoose.Schema({
  suggestion: {
    type: String, // The gift suggestion text
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the associated Event
    ref: 'Event',
    required: true
  }
});

// Export the GiftSuggestion model based on the schema
module.exports = mongoose.model('GiftSuggestion', giftSuggestionSchema);
