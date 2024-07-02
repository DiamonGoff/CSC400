import React, { useState } from 'react';
import './OrganizerInterface.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faCalendarAlt, faSearch, faTasks } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Map from './Map';

function OrganizerInterface() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/events', {
        name: eventName,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        description: eventDescription
      });
      alert('Event created successfully');
      console.log(response.data);
    } catch (error) {
      console.error('There was an error creating the event!', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:3001/places', {
        params: {
          query: searchQuery
        }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('There was an error searching for places!', error);
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
            <input 
              type="text" 
              placeholder="Event Name" 
              value={eventName} 
              onChange={(e) => setEventName(e.target.value)} 
              required 
            />
            <input 
              type="date" 
              placeholder="Date" 
              value={eventDate} 
              onChange={(e) => setEventDate(e.target.value)} 
              required 
            />
            <input 
              type="time" 
              placeholder="Time" 
              value={eventTime} 
              onChange={(e) => setEventTime(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Location" 
              value={eventLocation} 
              onChange={(e) => setEventLocation(e.target.value)} 
              required 
            />
            <textarea 
              placeholder="Description" 
              value={eventDescription} 
              onChange={(e) => setEventDescription(e.target.value)} 
              required 
            ></textarea>
            <button type="submit">Create Event</button>
          </form>
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faCalendarAlt} /> Manage Events</h2>
          <div className="event-list">
            <div className="event">
              <p>Event 1</p>
              <button className="btn-edit">Edit</button>
              <br /><br />
              <button className="btn-delete">Delete</button>
            </div>
            <div className="event">
              <p>Event 2</p>
              <button className="btn-edit">Edit</button>
              <br />
              <br />
              <button className="btn-delete">Delete</button>
            </div>
          </div>
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faSearch} /> Venue Search</h2>
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search for places" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              required 
            />
            <button type="submit">Search</button>
          </form>
          <ul>
            {searchResults.map((place, index) => (
              <li key={index}>{place.name} - {place.formatted_address}</li>
            ))}
          </ul>
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
