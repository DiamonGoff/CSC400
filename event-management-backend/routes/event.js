const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Notification = require('../models/Notification'); // Import Notification model
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');
const { sendEventInviteEmail } = require('../services/emailService');

// Get all events for a user
router.get('/', verifyToken, verifyRole(['organizer']), async (req, res) => {
  console.log('Fetching all events for user:', req.user._id);
  try {
    const events = await Event.find({ userId: req.user._id });
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get event details by ID
router.get('/:id', verifyToken, async (req, res) => {
  console.log('Fetching event by ID:', req.params.id);
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get events for a specific user by email
router.get('/users/:email/events', verifyToken, async (req, res) => {
  console.log('Fetching events for user email:', req.params.email);
  try {
    const events = await Event.find({ guestList: req.params.email });
    if (!events.length) {
      console.log('No events found for this user');
      return res.status(404).json({ message: 'No events found for this user' });
    }
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events for user:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/', verifyToken, verifyRole(['organizer']), async (req, res) => {
  console.log('Creating a new event:', req.body);
  const { name, date, time, description, latitude, longitude, guestList, specialRequirements } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and Longitude are required.' });
  }

  try {
    const event = new Event({
      name,
      date,
      time,
      location: {
        lat: latitude,
        lng: longitude
      },
      description,
      guestList,
      specialRequirements,
      userId: req.user._id,
    });

    const newEvent = await event.save();
    console.log('Event created successfully:', newEvent);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update an event
router.put('/:id', verifyToken, verifyRole(['organizer']), async (req, res) => {
  console.log('Updating event ID:', req.params.id);
  const { name, date, time, description, latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and Longitude are required.' });
  }

  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user._id });
    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ message: 'Event not found' });
    }

    event.name = name;
    event.date = date;
    event.time = time;
    event.location = { lat: latitude, lng: longitude };
    event.description = description;

    const updatedEvent = await event.save();
    console.log('Event updated successfully:', updatedEvent);
    res.json(updatedEvent);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete an event
router.delete('/:id', verifyToken, verifyRole(['organizer']), async (req, res) => {
  console.log('Deleting event ID:', req.params.id);
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user._id });
    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    console.log('Event deleted successfully');
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: err.message });
  }
});

// Send invite
router.post('/send-invite', verifyToken, verifyRole(['organizer']), async (req, res) => {
  const { eventId, guests } = req.body;
  console.log('Sending invites for event ID:', eventId, 'to guests:', guests);

  // Validate the eventId format
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID format' });
  }

  try {
    const event = await Event.findOne({ _id: new mongoose.Types.ObjectId(eventId), userId: req.user._id });
    if (!event) {
      console.error('Event not found for eventId:', eventId);
      return res.status(404).json({ message: 'Event not found' });
    }

    const newGuests = [];

    for (const guest of guests) {
      try {
        // Add guest to the event's guestList if not already added
        if (!event.guestList.includes(guest)) {
          event.guestList.push(guest);
          newGuests.push(guest);
        }

        const token = jwt.sign({ email: guest, eventId, inviterId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const inviteLink = `${process.env.CLIENT_URL}/register?token=${token}`;
        await sendEventInviteEmail(guest, inviteLink, event);
        console.log('Invite sent to:', guest);
      } catch (emailError) {
        console.error('Error sending email to:', guest, emailError);
        return res.status(500).json({ message: `Error sending email to ${guest}`, error: emailError.message });
      }
    }

    // Save the updated event with the new guests added to the guestList
    if (newGuests.length > 0) {
      await event.save();
      console.log('Guest list updated with new guests:', newGuests);
    }

    res.json({ message: 'Invites sent successfully and guests added to the guest list' });
  } catch (err) {
    console.error('Error in send-invite route:', err);
    res.status(500).json({ message: err.message });
  }
});

// RSVP to an event
router.post('/:id/rsvp', verifyToken, async (req, res) => {
  const { response } = req.body;
  console.log('RSVP to event ID:', req.params.id, 'with response:', response);
  console.log('User:', req.user); // Add this line to check the user in the request

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = req.user;

    const existingRsvpIndex = event.rsvps.findIndex(rsvp => rsvp.attendeeId.toString() === user._id.toString());
    if (existingRsvpIndex >= 0) {
      event.rsvps[existingRsvpIndex].response = response;
    } else {
      event.rsvps.push({
        attendeeId: user._id,
        attendeeName: user.name,
        attendeeEmail: user.email,
        response
      });
    }

    // Save the RSVP
    await event.save();

    // Send notification to the event organizer
    const notification = new Notification({
      message: `${user.name} has responded with "${response}" to the event "${event.name}"`,
      userId: event.userId // The organizer's userId
    });
    await notification.save();

    res.json({ message: 'RSVP saved successfully' });
  } catch (err) {
    console.error('Error saving RSVP:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get RSVP list for an event
router.get('/:id/rsvps', verifyToken, verifyRole(['organizer']), async (req, res) => {
  console.log('Fetching RSVP list for event ID:', req.params.id);
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event.rsvps);
  } catch (err) {
    console.error('Error fetching RSVP list:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get RSVP lists for all events of the authenticated user
router.get('/user/:userId/rsvps', verifyToken, async (req, res) => {
  console.log('Fetching RSVP list for all events created by user:', req.params.userId);
  try {
    const events = await Event.find({ userId: req.params.userId });
    if (!events.length) {
      return res.status(404).json({ message: 'No events found for this user' });
    }

    const rsvpLists = await Promise.all(events.map(async (event) => {
      const rsvps = event.rsvps;
      return {
        eventId: event._id,
        eventName: event.name,
        rsvps
      };
    }));

    res.json(rsvpLists);
  } catch (err) {
    console.error('Error fetching RSVP lists:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
