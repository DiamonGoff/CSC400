// my-app/src/components/CreateEvent.js

import React, { useState } from 'react';
import axios from 'axios';

const CreateEvent = ({ setMessage, setEvents, events }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/events', {
        name: eventName,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        description: eventDescription,
      });
      setMessage('Event created successfully');
      setEventName('');
      setEventDate('');
      setEventTime('');
      setEventLocation('');
      setEventDescription('');
      setEvents([...events, response.data]);
    } catch (error) {
      setMessage('There was an error creating the event!');
      console.error('Error creating event:', error.message);
    }
  };

  return (
    <form onSubmit={handleCreateEvent}>
      <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
      <input type="date" placeholder="Date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
      <input type="time" placeholder="Time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
      <input type="text" placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} required />
      <textarea placeholder="Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required ></textarea>
      <button type="submit" className="btn">Create Event</button>
    </form>
  );
};

export default CreateEvent;
