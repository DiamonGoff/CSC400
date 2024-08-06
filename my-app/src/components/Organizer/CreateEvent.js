import React, { useState } from 'react';
import axiosInstance from '../axiosInstance'; // Use the configured Axios instance

const CreateEvent = ({ setMessage, setEvents, events }) => {
  // Local state for form inputs
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const userId = localStorage.getItem('userId'); // Ensure userId is retrieved from localStorage

  // Handler for geocoding the event location to get latitude and longitude
  const geocodeLocation = async () => {
    try {
      const response = await axiosInstance.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: eventLocation,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });
      const location = response.data.results[0].geometry.location;
      setLatitude(location.lat);
      setLongitude(location.lng);
      return location;
    } catch (error) {
      console.error('Error geocoding location:', error);
      setMessage('There was an error getting the location coordinates.');
      throw new Error('Geocoding failed');
    }
  };

  // Handler for creating an event
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      const location = await geocodeLocation(); // Get the coordinates before creating the event
      if (!location.lat || !location.lng) {
        setMessage('Latitude and Longitude are required.');
        return;
      }

      // API call to create a new event
      const response = await axiosInstance.post('/events', {
        name: eventName,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        description: eventDescription,
        latitude: location.lat,
        longitude: location.lng,
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
      setLatitude('');
      setLongitude('');
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
      <input type="time" placeholddfgbsfdgsdfggfder="Time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
      <input type="text" placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} required />
      <textarea placeholder="Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required ></textarea>
      <button type="submit" className="btn">Create Event</button>
    </form>
  );
};

export default CreateEvent;
