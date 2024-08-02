const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const { sendEventInviteEmail } = require('../services/emailService');

// Get all events
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/', auth, async (req, res) => {
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
      userId: req.user // Add userId to the event
    });

    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
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
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
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
router.post('/send-invite', auth, async (req, res) => {
  const { eventId, guests } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Here you would implement the logic to send invites via email
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
