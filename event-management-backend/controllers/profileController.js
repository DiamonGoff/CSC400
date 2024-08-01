const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Get profile by user ID
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update profile
router.put('/:userId', async (req, res) => {
  try {
    const { name, email, preferences, venueTypes, guestPreferences, invitationStyles } = req.body;
    const profileData = { userId: req.params.userId, name, email, preferences, venueTypes, guestPreferences, invitationStyles };

    const profile = await Profile.findOneAndUpdate({ userId: req.params.userId }, profileData, { new: true, upsert: true });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
