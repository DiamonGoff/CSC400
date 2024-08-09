const mongoose = require('mongoose');

// Define schema for users
const UserSchema = new mongoose.Schema({
  name: {
    type: String, // User's name
    required: true,
  },
  email: {
    type: String, // User's email, must be unique
    required: true,
    unique: true,
  },
  password: {
    type: String, // User's password
    required: true,
  },
  role: {
    type: String, // User's role, either 'organizer' or 'attendee'
    enum: ['organizer', 'attendee'],
    default: 'organizer', // Default role set to 'organizer'
  },
  isVerified: {
    type: Boolean, // Whether the user's email is verified
    default: false,
  },
  verificationToken: {
    type: String, // Token for email verification
  },
  verificationTokenExpiry: {
    type: Date, // Expiry date for the verification token
  },
  facebookId: {
    type: String, // User's Facebook ID for OAuth
    unique: true,
    sparse: true, // Allow multiple users without Facebook ID
  },
  twitterId: {
    type: String, // User's Twitter ID for OAuth
    unique: true,
    sparse: true, // Allow multiple users without Twitter ID
  },
});

// Export User model based on the schema
module.exports = mongoose.model('User', UserSchema);
