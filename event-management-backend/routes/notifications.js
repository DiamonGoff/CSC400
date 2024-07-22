const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification'); // Assuming you have a Notification model

// Get notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.send(notifications);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
