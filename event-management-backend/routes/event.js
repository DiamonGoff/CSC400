const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const verifyToken = require('../middleware/verifyToken'); // Updated to use verifyToken middleware
const { sendEventInviteEmail } = require('../services/emailService');

// Get all events
router.get('/', verifyToken, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/', verifyToken, async (req, res) => {
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
      userId: req.userId // Ensure userId is added to the event
    });

    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an event
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.userId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    Object.assign(event, req.body);

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an event
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.userId });
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
router.post('/send-invite', verifyToken, async (req, res) => {
  const { eventId, guests } = req.body;
  try {
    const event = await Event.findOne({ _id: eventId, userId: req.userId });
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
