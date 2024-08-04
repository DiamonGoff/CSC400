const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');
const verifyToken = require('../middleware/verifyToken'); // Use the new middleware

// Get all guests for an event
router.get('/events/:eventId/guests', verifyToken, async (req, res) => {
  try {
    const guests = await Guest.find({ event: req.params.eventId });
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new guest
router.post('/events/:eventId/guests', verifyToken, async (req, res) => {
  const guest = new Guest({
    name: req.body.name,
    email: req.body.email,
    rsvp: req.body.rsvp,
    event: req.params.eventId
  });

  try {
    const newGuest = await guest.save();
    res.status(201).json(newGuest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a guest
router.put('/guests/:id', verifyToken, async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    guest.name = req.body.name;
    guest.email = req.body.email;
    guest.rsvp = req.body.rsvp;

    const updatedGuest = await guest.save();
    res.json(updatedGuest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a guest
router.delete('/guests/:id', verifyToken, async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    await guest.remove();
    res.json({ message: 'Guest deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
