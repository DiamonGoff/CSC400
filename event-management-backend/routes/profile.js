const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path if necessary

// Get profile
router.get('/:userId', async (req, res) => {
    try {
        console.log('Fetching profile for userId:', req.params.userId);
        const user = await User.findById(req.params.userId);
        if (!user) {
            console.error('User not found');
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        res.status(500).send(error.message);
    }
});

// Update profile
router.put('/:userId', async (req, res) => {
    try {
        console.log('Updating profile for userId:', req.params.userId);
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            {
                name: req.body.name,
                contact: req.body.contact,
                preferences: req.body.preferences
            },
            { new: true }
        );
        if (!user) {
            console.error('User not found');
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).send(error.message);
    }
});

module.exports = router;
