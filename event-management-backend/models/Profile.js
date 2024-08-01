const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  preferences: { type: String },
  venueTypes: { type: String },
  guestListPreferences: { type: String },
  invitationStyles: { type: String },
  email: { type: String, required: true }
});

module.exports = mongoose.model('Profile', ProfileSchema);
