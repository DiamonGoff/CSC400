// my-app/src/components/ManageEvents.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageEvents = ({ setMessage, events, setEvents }) => {
  const [editEventId, setEditEventId] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  useEffect(() => {
    if (editEventId) {
      const event = events.find(event => event._id === editEventId);
      setEventName(event.name);
      setEventDate(event.date);
      setEventTime(event.time);
      setEventLocation(event.location);
      setEventDescription(event.description);
    }
  }, [editEventId, events]);

  const handleEventUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3001/events/${editEventId}`, {
        name: eventName,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        description: eventDescription,
      });
      setEvents(events.map(event => (event._id === editEventId ? response.data : event)));
      setMessage('Event updated successfully');
      setEditEventId(null);
      setEventName('');
      setEventDate('');
      setEventTime('');
      setEventLocation('');
      setEventDescription('');
    } catch (error) {
      setMessage('There was an error updating the event!');
      console.error('Error updating event:', error.message);
    }
  };

  const handleEventDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:3001/events/${eventId}`);
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('There was an error deleting the event!', error);
    }
  };

  return (
    <div className="event-list">
      {events.map(event => (
        <div key={event._id} className="event">
          <p><strong>Name:</strong> {event.name}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Description:</strong> {event.description}</p>
          <button className="btn" onClick={() => setEditEventId(event._id)}>Edit</button>
          <button className="btn" onClick={() => handleEventDelete(event._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ManageEvents;
