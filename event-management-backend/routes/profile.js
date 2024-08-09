const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); // Middleware to verify JWT token
const User = require('../models/User');

// Route to get a user by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Respond with 404 if user is not found
    }
    res.json(user); // Respond with user data
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message }); // Handle any server errors
  }
});

// Route to update a user by ID
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update user and return the updated document
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Respond with 404 if user is not found
    }
    res.json(user); // Respond with the updated user data
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message }); // Handle any server errors
  }
});

module.exports = router; // Export the router
