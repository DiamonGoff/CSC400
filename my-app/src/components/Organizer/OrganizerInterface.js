import React, { useState, useEffect, useCallback } from 'react';
import './OrganizerInterface.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faCalendarAlt, faSearch, faTasks, faUser, faBell, faChartBar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import TaskManagement from './TaskManagement';

const amenitiesOptions = [
  { value: 'WiFi', label: 'WiFi' },
  { value: 'Parking', label: 'Parking' },
  { value: 'Restrooms', label: 'Restrooms' },
  { value: 'AV Equipment', label: 'AV Equipment' },
  // Add other amenities options here
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

  // Profile State
  const [profile, setProfile] = useState({ name: '', contact: '', preferences: '' });

  // Notifications State
  const [notifications, setNotifications] = useState([]);

  // Map State
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [mapZoom, setMapZoom] = useState(12);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.error('User ID is missing, redirecting to login');
      navigate('/login');
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

  const fetchProfile = useCallback(async () => {
    try {
      console.log(`Fetching profile for userId: ${userId}`);
      const response = await axios.get(`http://localhost:3001/profile/${userId}`, {
        withCredentials: true
      });
      setProfile(response.data);
    } catch (error) {
      console.error('There was an error fetching the profile!', error);
    }
  }, [userId]);

  const fetchNotifications = useCallback(async () => {
    try {
      console.log(`Fetching notifications`);
      const response = await axios.get('http://localhost:3001/notifications', {
        withCredentials: true
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('There was an error fetching the notifications!', error);
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/events');
      setEvents(response.data);
    } catch (error) {
      console.error('There was an error fetching the events!', error);
    }
  }, [userId]);

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

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!userId) {
      setMessage('User ID is missing. Please log in again.');
      return;
    }
    try {
      console.log(`Saving profile for userId: ${userId}`);
      const response = await axios.put(`http://localhost:3001/profile/${userId}`, profile);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('There was an error updating the profile!');
      console.error('Error updating profile:', error.message);
    }
  };

  return (
    <div className="organizer-background">
      <div className="container">
        <header className="header">
          <h1>Event Organizer Interface</h1>
        </header>
        <nav>
          <Link to="/organizer/profile" className="btn"><FontAwesomeIcon icon={faUser} /> Profile</Link>
          <Link to="/organizer/venue-management" className="btn"><FontAwesomeIcon icon={faSearch} /> Venue Management</Link>
          <Link to="/organizer/task-management" className="btn"><FontAwesomeIcon icon={faTasks} /> Task Management</Link>
          <Link to="/organizer/notifications" className="btn"><FontAwesomeIcon icon={faBell} /> Notifications</Link>
          <Link to="/organizer/analytics" className="btn"><FontAwesomeIcon icon={faChartBar} /> Analytics</Link>
        </nav>

        {/* Profile Section */}
        <section>
          <h2>Profile Management</h2>
          <form onSubmit={handleProfileSave}>
            <input
              type="text"
              placeholder="Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Contact Information"
              value={profile.contact}
              onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
            />
            <textarea
              placeholder="Event Preferences"
              value={profile.preferences}
              onChange={(e) => setProfile({ ...profile, preferences: e.target.value })}
            ></textarea>
            <button className="btn">Save Profile</button>
          </form>
        </section>

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
              id="autocomplete" 
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
                {/* Task Management Section */}
                <section>
                  <TaskManagement eventId={event._id} />
                </section>
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
                <VenueCard key={index} venue={venue} />
              ))}
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <h2><FontAwesomeIcon icon={faBell} /> Notifications</h2>
          <ul>
            {notifications.map(notification => (
              <li key={notification._id}>{notification.message}</li>
            ))}
          </ul>
        </section>

        {/* Analytics and Reporting Section */}
        <section>
          <h2><FontAwesomeIcon icon={faChartBar} /> Analytics and Reporting</h2>
          <p>Analytics and reporting will be implemented here...</p>
        </section>

        <footer>
          &copy; 2024 EventConnect. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default OrganizerInterface;
