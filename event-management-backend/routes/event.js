const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Guest = require('../models/Guest');
const axios = require('axios');
const { searchPlaces } = require('../services/googlePlacesService');
const { getAuthUrl, setAuthToken, createEvent } = require('../services/googleCalendarService');

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
  const { name, date, time, location, description } = req.body;

  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
    const { lat, lng } = response.data.results[0].geometry.location;

    const event = new Event({
      name,
      date,
      time,
      location,
      latitude: lat,
      longitude: lng,
      description
    });

    const newEvent = await event.save();

    // Create a calendar event
    await createEvent({
      summary: newEvent.name,
      location: newEvent.location,
      description: newEvent.description,
      start: {
        dateTime: newEvent.date,
        timeZone: 'America/New_York', // Change this to your desired timezone
      },
      end: {
        dateTime: newEvent.date,
        timeZone: 'America/New_York', // Change this to your desired timezone
      },
    });

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

    if (req.body.location) {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(req.body.location)}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
      const { lat, lng } = response.data.results[0].geometry.location;
      event.latitude = lat;
      event.longitude = lng;
      event.location = req.body.location;
    }

    event.name = req.body.name;
    event.date = req.body.date;
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

    await event.deleteOne();
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
router.put('/guests/:id', async (req, res) => {
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
router.delete('/guests/:id', async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    await guest.deleteOne();
    res.json({ message: 'Guest deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to search for places
router.get('/places', async (req, res) => {
  try {
    const query = req.query.query;
    const places = await searchPlaces(query);
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get Google OAuth URL
router.get('/auth/google', (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

// OAuth2 callback route
router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  try {
    const token = await setAuthToken(code);
    res.json(token);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create an event in Google Calendar
router.post('/google-calendar/events', async (req, res) => {
  const event = req.body;
  try {
    const response = await createEvent(event);
    res.status(201).json(response.data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
