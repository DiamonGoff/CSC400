import React, { useState, useEffect } from 'react';
import './OrganizerInterface.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faCalendarAlt, faSearch, faTasks } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Map from './Map';

function OrganizerInterface() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/events', newEvent);
      // Refresh events after creating a new one
      const response = await axios.get('http://localhost:3000/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:3000/events/${eventId}`);
      // Refresh events after deletion
      const response = await axios.get('http://localhost:3000/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="organizer-background">
      <div className="container">
        <header className="header">
          <h1>Event Organizer Interface</h1>
        </header>
        <section>
          <br />
          <h2><FontAwesomeIcon icon={faCalendarPlus} /> Create New Event</h2>
          <form onSubmit={handleCreateEvent}>
            <input type="text" name="name" placeholder="Event Name" onChange={handleChange} />
            <input type="date" name="date" placeholder="Date" onChange={handleChange} />
            <input type="time" name="time" placeholder="Time" onChange={handleChange} />
            <input type="text" name="location" placeholder="Location" onChange={handleChange} />
            <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
            <button type="submit">Create Event</button>
          </form>
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faCalendarAlt} /> Manage Events</h2>
          <div className="event-list">
            {events.map((event) => (
              <div className="event" key={event._id}>
                <p>{event.name}</p>
                <button className="btn-edit">Edit</button>
                <br /><br />
                <button className="btn-delete" onClick={() => handleDeleteEvent(event._id)}>Delete</button>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faSearch} /> Venue Search</h2>
          <form>
            <input type="text" placeholder="Location" />
            <input type="text" placeholder="Capacity" />
            <input type="text" placeholder="Amenities" />
            <input type="text" placeholder="Budget" />
            <button type="submit">Search</button>
          </form>
          <Map center={{ lat: -34.397, lng: 150.644 }} zoom={8} />
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faTasks} /> Task Management</h2>
          <div className="task-list">
            <div className="task">
              <p>Task 1</p>
              <button className="btn-edit">Edit</button>
              <br />
              <br />
              <button className="btn-complete">Complete</button>
            </div>
            <div className="task">
              <p>Task 2</p>
              <button className="btn-edit">Edit</button>
              <br />
              <br />
              <button className="btn-complete">Complete</button>
            </div>
          </div>
        </section>
        <footer>
          &copy; 2024 EventConnect. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default OrganizerInterface;
