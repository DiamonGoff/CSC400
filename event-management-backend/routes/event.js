const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { sendEventInviteEmail } = require('../services/emailService');
const authenticate = require('../middleware/authenticate');

// Get all events for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/', authenticate, async (req, res) => {
  const { name, date, time, location, description, guestList, specialRequirements } = req.body;

  try {
    const event = new Event({
      name,
      date,
      time,
      location,
      description,
      guestList,
      specialRequirements,
      userId: req.user._id
    });

    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an event
router.put('/:id', authenticate, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user._id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.name = req.body.name || event.name;
    event.date = req.body.date || event.date;
    event.time = req.body.time || event.time;
    event.location = req.body.location || event.location;
    event.description = req.body.description || event.description;
    event.guestList = req.body.guestList || event.guestList;
    event.specialRequirements = req.body.specialRequirements || event.specialRequirements;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an event
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user._id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send invite
router.post('/send-invite', authenticate, async (req, res) => {
  const { eventId, guests } = req.body;
  try {
    const event = await Event.findOne({ _id: eventId, userId: req.user._id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    for (const guest of guests) {
      await sendEventInviteEmail(guest, event);
      event.guestList.push(guest);
    }

    await event.save();

    res.json({ message: 'Invites sent successfully', event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
