const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Update profile route
router.post('/profile', async (req, res) => {
  const { email, name, contact, preferences, venueTypes, guestListPreferences, invitationStyles } = req.body;

  try {
    // Find the user by email and update their profile
    const user = await User.findOneAndUpdate(
      { email },
      { name, contact, preferences, venueTypes, guestListPreferences, invitationStyles },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile.', error: error.message });
  }
});

module.exports = router;
