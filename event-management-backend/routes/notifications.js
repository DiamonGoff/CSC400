const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const verifyToken = require('../middleware/verifyToken'); // Use the new middleware

// Get notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId });
    res.send(notifications);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
