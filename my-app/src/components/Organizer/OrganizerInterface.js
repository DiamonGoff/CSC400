import React, { useState, useEffect, useCallback } from 'react';
import './OrganizerInterface.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faCalendarAlt, faSearch, faTasks, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import TaskManagement from './TaskManagement';
import VenueCard from './VenueCard';
import Map from './Map';

const amenitiesOptions = [
  { value: 'WiFi', label: 'WiFi' },
  { value: 'Parking', label: 'Parking' },
  { value: 'Restrooms', label: 'Restrooms' },
  { value: 'AV Equipment', label: 'AV Equipment' },
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
  { value: 'Accessible Facilities', label: 'Accessible Facilities (Wheelchair Access)' },
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

function OrganizerInterface({ user, setUser }) {
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
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [mapZoom, setMapZoom] = useState(12);
  const [favoriteVenues, setFavoriteVenues] = useState([]);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.error('User ID is missing, redirecting to login');
      navigate('/login');
    } else {
      fetchUser();
    }
  }, [userId, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/events');
        setEvents(response.data);
      } catch (error) {
        console.error('There was an error fetching the events!', error);
      }
    };
    if (userId) {
      fetchEvents();
    }
  }, [userId]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${userId}`, {
        withCredentials: true
      });
      setUser(response.data);
    } catch (error) {
      console.error('There was an error fetching the user!', error);
    }
  }, [userId, setUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

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
        specialRequirements: '',
        userId: userId
      }, {
        withCredentials: true
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

  const handleInviteSend = async (eventId) => {
    const guests = invite.split(',').map(email => email.trim());
    try {
      await axios.post('http://localhost:3001/events/send-invite', {
        eventId,
        guests
      }, {
        withCredentials: true
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
      }, {
        withCredentials: true
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
      await axios.delete(`http://localhost:3001/events/${eventId}`, {
        withCredentials: true
      });
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
        },
        withCredentials: true
      });
      setVenues(response.data);
    } catch (error) {
      console.error('There was an error searching for venues!', error);
    }
  };

  const handlePlaceSelected = (place) => {
    setEventLocation(place.formatted_address);
    setMapCenter(place.geometry.location);
    setMapZoom(15);
  };

  const handleFavoriteVenue = (venue) => {
    setFavoriteVenues(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(favVenue => favVenue._id === venue._id);
      if (isAlreadyFavorite) {
        return prevFavorites.filter(favVenue => favVenue._id !== venue._id);
      }
      return [...prevFavorites, venue];
    });
  };

  return (
    <div className="organizer-background">
      <div className="container">
        <nav className="organizer-nav">
          <Link to="/organizer/profile" className="btn"><FontAwesomeIcon icon={faUser} /> Profile</Link>
          <Link to="/organizer/venue-management" className="btn"><FontAwesomeIcon icon={faSearch} /> Venue Management</Link>
          <Link to="/organizer/task-management" className="btn"><FontAwesomeIcon icon={faTasks} /> Task Management</Link>
          
        </nav>

        {/* Event Management Section */}
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

        {/* Event List Section */}
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
                  style={{ width: '300px' }} 
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

        {/* Venue Search Section */}
        <section>
          <h2><FontAwesomeIcon icon={faSearch} /> Venue Search</h2>
          <form onSubmit={handleVenueSearch}>
            <input type="text" id="autocomplete" placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} required />
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
          <div className="results">
            <Map center={mapCenter} zoom={mapZoom} onPlaceSelected={handlePlaceSelected} />
            <div className="venue-list">
              {venues.map((venue, index) => (
                <VenueCard key={index} venue={venue} onFavoriteChange={() => handleFavoriteVenue(venue)} />
              ))}
            </div>
          </div>
        </section>

        {/* Task Management Section */}
        <section>
          <h2><FontAwesomeIcon icon={faTasks} /> Task Management</h2>
          <TaskManagement />
        </section>

        <footer>
          &copy; 2024 EventConnect. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default OrganizerInterface;
