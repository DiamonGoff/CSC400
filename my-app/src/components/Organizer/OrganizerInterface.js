// src/components/Organizer/OrganizerInterface.js

import React, { useState, useEffect } from 'react';
import './OrganizerInterface.css'; // Ensure this import is present
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faCalendarAlt, faSearch, faTasks } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import TaskManagement from './TaskManagement'; // Import TaskManagement component

const amenitiesOptions = [
  { value: 'WiFi', label: 'WiFi' },
  { value: 'Parking', label: 'Parking' },
  { value: 'Restrooms', label: 'Restrooms' },
  { value: 'AV Equipment (Audio/Visual)', label: 'AV Equipment (Audio/Visual)' },
  { value: 'Stage', label: 'Stage' },
  { value: 'Dance Floor', label: 'Dance Floor' },
  { value: 'Outdoor Area', label: 'Outdoor Area' },
  { value: 'Catering Services', label: 'Catering Services' },
  { value: 'Bar Services', label: 'Bar Services' },
  { value: 'Tables and Chairs', label: 'Tables and Chairs' },
  { value: 'Linens', label: 'Linens' },
  { value: 'Decorations', label: 'Decorations' },
  { value: 'Lighting', label: 'Lighting' },
  { value: 'DJ or Live Music', label: 'DJ or Live Music' },
  { value: 'Photo Booth', label: 'Photo Booth' },
  { value: 'Projector and Screen', label: 'Projector and Screen' },
  { value: 'Private Rooms', label: 'Private Rooms' },
  { value: 'Kids Play Area', label: 'Kids Play Area' },
  { value: 'Air Conditioning/Heating', label: 'Air Conditioning/Heating' },
  { value: 'Accessible Facilities (Wheelchair Access)', label: 'Accessible Facilities (Wheelchair Access)' },
  { value: 'Coat Check', label: 'Coat Check' },
  { value: 'Security Services', label: 'Security Services' },
  { value: 'Sound System', label: 'Sound System' },
  { value: 'Games and Entertainment', label: 'Games and Entertainment' },
  { value: 'Pet-Friendly', label: 'Pet-Friendly' },
  { value: 'Swimming Pool', label: 'Swimming Pool' },
  { value: 'Spa Services', label: 'Spa Services' },
  { value: 'Backup Power Supply', label: 'Backup Power Supply' },
  { value: 'Fireplace', label: 'Fireplace' },
  { value: 'Smoking Area', label: 'Smoking Area' },
  { value: 'Food', label: 'Food' }
];

function OrganizerInterface() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [message, setMessage] = useState('');
  const [venues, setVenues] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [capacity, setCapacity] = useState('');
  const [budget, setBudget] = useState('');
  const [events, setEvents] = useState([]);
  const [invite, setInvite] = useState('');
  const [editEventId, setEditEventId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/events');
        setEvents(response.data);
      } catch (error) {
        console.error('There was an error fetching the events!', error);
      }
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/events', {
        name: eventName,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        description: eventDescription,
        guestList: [],
        specialRequirements: ''
      });
      setMessage('Event created successfully');
      setEventName('');
      setEventDate('');
      setEventTime('');
      setEventLocation('');
      setEventDescription('');
      setEvents([...events, response.data]); // Add the new event to the events array
    } catch (error) {
      setMessage('There was an error creating the event!');
    }
  };

  const handleInviteSend = async (eventId) => {
    const guests = invite.split(',').map(email => email.trim());
    try {
      await axios.post('http://localhost:3001/events/send-invite', {
        eventId,
        guests
      });
      setMessage('Invites sent successfully');
      setInvite('');
    } catch (error) {
      console.error('There was an error sending the invites!', error);
      setMessage('There was an error sending the invites!');
    }
  };

  const handleEventEdit = (eventId) => {
    setEditEventId(eventId);
    const event = events.find(event => event._id === eventId);
    setEventName(event.name);
    setEventDate(event.date);
    setEventTime(event.time);
    setEventLocation(event.location);
    setEventDescription(event.description);
  };

  const handleEventUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3001/events/${editEventId}`, {
        name: eventName,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        description: eventDescription
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

  const handleVenueSearch = async (e) => {
    e.preventDefault();
    const amenities = selectedAmenities.map(option => option.value).join(',');
    try {
      const response = await axios.get('http://localhost:3001/venues/search', {
        params: {
          location: eventLocation,
          capacity,
          amenities,
          budget
        }
      });
      setVenues(response.data);
    } catch (error) {
      console.error('There was an error searching for venues!', error);
    }
  };

  return (
    <div className="organizer-background">
      <div className="container">
        <header className="header">
          <h1>Event Organizer Interface</h1>
        </header>
        <nav>
          <Link to="/organizer/profile" className="btn">Profile</Link>
          <Link to="/organizer/venue-management" className="btn">Venue Management</Link>
          <Link to="/organizer/task-management" className="btn">Task Management</Link>
        </nav>
        <section>
          <br />
          <h2><FontAwesomeIcon icon={faCalendarPlus} /> {editEventId ? 'Edit Event' : 'Create New Event'}</h2>
          {message && <div className="confirmation-message">{message}</div>}
          <form onSubmit={editEventId ? handleEventUpdate : handleCreateEvent}>
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
            <button type="submit" className="btn">{editEventId ? 'Update Event' : 'Create Event'}</button>
          </form>
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faCalendarAlt} /> Manage Events</h2>
          <div className="event-list">
            {events.map(event => (
              <div key={event._id} className="event">
                <p><strong>Name:</strong> {event.name}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Description:</strong> {event.description}</p>
                <input 
                  type="text" 
                  style={{ width: '300px' }} // Make input box longer
                  placeholder="Guest Emails (comma separated)" 
                  value={invite} 
                  onChange={(e) => setInvite(e.target.value)} 
                />
                <button className="btn" onClick={() => handleInviteSend(event._id)}>Send Invites</button>
                <button className="btn" onClick={() => handleEventEdit(event._id)}>Edit</button>
                <button className="btn" onClick={() => handleEventDelete(event._id)}>Delete</button>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faSearch} /> Venue Search</h2>
          <form onSubmit={handleVenueSearch}>
            <input type="text" placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} required />
            <input type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
            <Select
              isMulti
              options={amenitiesOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={selectedAmenities}
              onChange={setSelectedAmenities}
              placeholder="Select the Amenities you'd like"
            />
            <input type="number" placeholder="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} required />
            <button type="submit" className="btn">Search</button>
          </form>
          <div className="venue-list">
            {venues.map((venue, index) => (
              <div key={index} className="venue">
                <h3>{venue.name}</h3>
                <p><strong>Address:</strong> {venue.address}</p>
                <p><strong>Capacity:</strong> {venue.capacity}</p>
                <p><strong>Amenities:</strong> {(venue.amenities || []).join(', ')}</p>
                <p><strong>Price:</strong> {venue.price}</p>
                <p><strong>Phone:</strong> {venue.phone_number}</p>
                <p><strong>Website:</strong> <a href={venue.website} target="_blank" rel="noopener noreferrer">{venue.website}</a></p>
              </div>
            ))}
          </div>
        </section>
        <TaskManagement /> {/* Add TaskManagement component here */}
        <footer>
          &copy; 2024 EventConnect. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default OrganizerInterface;
