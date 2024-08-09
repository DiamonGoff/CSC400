const mongoose = require('mongoose');

// Define schema for user profiles
const ProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // Reference to the associated User
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, // User's name
    required: true 
  },
  contact: { 
    type: String, // User's contact information
    required: true 
  },
  preferences: { 
    type: String // User's general preferences (optional)
  },
  venueTypes: { 
    type: String // Preferred types of venues (optional)
  },
  guestListPreferences: { 
    type: String // Preferences for guest lists (optional)
  },
  invitationStyles: { 
    type: String // Preferred invitation styles (optional)
  },
  email: { 
    type: String, // User's email address
    required: true 
  }
});

// Export Profile model based on the schema
module.exports = mongoose.model('Profile', ProfileSchema);
