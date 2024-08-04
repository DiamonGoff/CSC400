import React, { useState } from 'react';
import axiosInstance from '../axiosInstance'; // Use the configured Axios instance

const CreateEvent = ({ setMessage, setEvents, events }) => {
  // Local state for form inputs
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const userId = localStorage.getItem('userId'); // Ensure userId is retrieved from localStorage

  // Handler for creating an event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      // API call to create a new event
      const response = await axiosInstance.post('/events', {
        name: eventName,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        description: eventDescription,
        userId: userId // Ensure userId is included in the event data
      });
      // Update the message and events state upon successful creation
      setMessage('Event created successfully');
      setEvents([...events, response.data]);
      // Reset form inputs
      setEventName('');
      setEventDate('');
      setEventTime('');
      setEventLocation('');
      setEventDescription('');
    } catch (error) {
      // Handle errors
      setMessage('There was an error creating the event!');
      console.error('Error creating event:', error.message);
    }
  };

  return (
    // Form for creating a new event
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
