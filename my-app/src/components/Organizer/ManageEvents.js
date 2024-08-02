import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageEvents = ({ setMessage, events, setEvents }) => {
  // Local state for form inputs and editing
  const [editEventId, setEditEventId] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  useEffect(() => {
    if (editEventId) {
      // Find and set the event details for editing
      const event = events.find(event => event._id === editEventId);
      setEventName(event.name);
      setEventDate(event.date);
      setEventTime(event.time);
      setEventLocation(event.location);
      setEventDescription(event.description);
    }
  }, [editEventId, events]);

  // Handler for updating an event
  const handleEventUpdate = async (e) => {
    e.preventDefault();
    try {
      // API call to update the event
      const response = await axios.put(`http://localhost:3001/events/${editEventId}`, {
        name: eventName,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        description: eventDescription,
      });
      // Update events state and reset form inputs
      setEvents(events.map(event => (event._id === editEventId ? response.data : event)));
      setMessage('Event updated successfully');
      setEditEventId(null);
      setEventName('');
      setEventDate('');
      setEventTime('');
      setEventLocation('');
      setEventDescription('');
    } catch (error) {
      // Handle errors
      setMessage('There was an error updating the event!');
      console.error('Error updating event:', error.message);
    }
  };

  // Handler for deleting an event
  const handleEventDelete = async (eventId) => {
    try {
      // API call to delete the event
      await axios.delete(`http://localhost:3001/events/${eventId}`);
      // Update events state
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
      {editEventId && (
        // Form for updating an existing event
        <form onSubmit={handleEventUpdate}>
          <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
          <input type="date" placeholder="Date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
          <input type="time" placeholder="Time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
          <input type="text" placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} required />
          <textarea placeholder="Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} required ></textarea>
          <button type="submit" className="btn">Update Event</button>
        </form>
      )}
    </div>
  );
};

export default ManageEvents;
