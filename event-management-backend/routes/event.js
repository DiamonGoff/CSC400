const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Guest = require('../models/Guest'); // Make sure you import the Guest model

// Get all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().populate('guests');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/events', async (req, res) => {
  const event = new Event({
    name: req.body.name,
    date: req.body.date,
    location: req.body.location,
    description: req.body.description
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an event
router.put('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.name = req.body.name;
    event.date = req.body.date;
    event.location = req.body.location;
    event.description = req.body.description;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an event
router.delete('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new guest
router.post('/events/:eventId/guests', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const guest = new Guest({
      name: req.body.name,
      email: req.body.email,
      rsvp: req.body.rsvp,
      event: event._id
    });

    const newGuest = await guest.save();
    event.guests.push(newGuest._id);
    await event.save();

    res.status(201).json(newGuest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all guests for an event
router.get('/events/:eventId/guests', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('guests');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event.guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a guest
router.put('/guests/:guestId', async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.guestId);
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
router.delete('/guests/:guestId', async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.guestId);
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
