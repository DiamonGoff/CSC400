const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiry: {
    type: Date,
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },
  twitterId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
