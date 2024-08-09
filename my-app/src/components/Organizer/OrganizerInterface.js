import React, { useState, useEffect, useCallback } from 'react';
import './OrganizerInterface.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faCalendarAlt, faSearch, faTasks, faList } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import TaskManagement from './TaskManagement';
import VenueCard from './VenueCard';
import Map from './Map';

const amenitiesOptions = [
  { value: 'WiFi', label: 'WiFi' },

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
  const [tasks, setTasks] = useState([]);
  const [inviteInputs, setInviteInputs] = useState({});
  const [editEventId, setEditEventId] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [mapZoom, setMapZoom] = useState(12);
  const [favoriteVenues, setFavoriteVenues] = useState([]);
  const [rsvpList, setRsvpList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  console.log('userId:', userId); // Debugging line

  const fetchUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('There was an error fetching the user!', error);
    }
  }, [userId, setUser]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('There was an error fetching users!', error);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      console.error('User ID is missing, redirecting to login');
      navigate('/login');
    } else {
      fetchUser();
      fetchUsers();
    }
  }, [userId, navigate, fetchUser, fetchUsers]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('There was an error fetching the events!', error);
      }
    };
    if (userId) {
      fetchEvents();
    }
  }, [userId]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('There was an error fetching the tasks!', error);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId, fetchTasks]);

  const geocodeLocation = async () => {
    try {
      const response = await axiosInstance.get('/geocode', {
        params: {
          address: eventLocation,
        },
      });
      const location = response.data;
      return location;
    } catch (error) {
      console.error('Error geocoding location:', error);
      setMessage('There was an error getting the location coordinates.');
      throw new Error('Geocoding failed');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const location = await geocodeLocation();
      if (!location.lat || !location.lng) {
        setMessage('Latitude and Longitude are required.');
        return;
      }

      const response = await axiosInstance.post('/events', {
        name: eventName,
        date: eventDate,
        time: eventTime,
        description: eventDescription,
        venue: eventLocation, // Save venue name
        latitude: location.lat,
        longitude: location.lng,
        guestList: [],
        specialRequirements: '',
        userId: userId
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

  const handleInviteChange = (eventId, value) => {
    setInviteInputs(prevInputs => ({
      ...prevInputs,
      [eventId]: value,
    }));
  };

  const handleInviteSend = async (eventId) => {
    const guests = inviteInputs[eventId]?.split(',').map(email => email.trim());
    try {
      await axiosInstance.post('/events/send-invite', {
        eventId,
        guests
      });
      setMessage('Invites sent successfully');
      handleInviteChange(eventId, ''); // Clear the input field after sending invites
    } catch (error) {
      console.error('There was an error sending the invites!', error);
      setMessage('There was an error sending the invites!');
    }
  };

  const handleEventEdit = (eventId) => {
    setEditEventId(eventId);
    const event = events.find(event => event._id === eventId);
    const eventDate = new Date(event.date);
    eventDate.setDate(eventDate.getDate() + 1); // Add one day to the date
    setEventName(event.name);
    setEventDate(eventDate.toISOString().split('T')[0]); // Ensure correct date format (YYYY-MM-DD)
    setEventTime(convertTo12HourFormat(event.time));
    setEventLocation(event.location.name); // Assuming location is now an object with name, lat, lng
    setEventDescription(event.description);
  };

  const handleEventUpdate = async (e) => {
    e.preventDefault();
    try {
      const location = await geocodeLocation();
      if (!location.lat || !location.lng) {
        setMessage('Latitude and Longitude are required.');
        return;
      }

      const response = await axiosInstance.put(`/events/${editEventId}`, {
        name: eventName,
        date: eventDate,
        time: eventTime,
        description: eventDescription,
        venue: eventLocation, // Save venue name
        latitude: location.lat,
        longitude: location.lng
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
      await axiosInstance.delete(`/events/${eventId}`);
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('There was an error deleting the event!', error);
    }
  };

  const handleVenueSearch = async (e) => {
    e.preventDefault();
    const amenities = selectedAmenities.map(option => option.value).join(',');
    try {
      const response = await axiosInstance.get('/venues/search', {
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

  useEffect(() => {
    const fetchRsvpList = async () => {
      if (events.length > 0) {
        const eventId = events[0]._id; // Select the first event
        setSelectedEvent(eventId);
        try {
          const response = await axiosInstance.get(`/events/${eventId}/rsvps`);
          setRsvpList(response.data);
        } catch (error) {
          console.error('There was an error fetching the RSVP list!', error);
          setMessage('There was an error fetching the RSVP list!');
        }
      }
    };

    fetchRsvpList();
  }, [events]);

  // Helper function to convert time to 12-hour format with AM/PM
  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM/PM
    return `${adjustedHours}:${minutes} ${period}`;
  };

  // Helper function to convert time from 12-hour format to 24-hour format
  const convertTo24HourFormat = (time) => {
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':');
    const adjustedHours = period === 'PM' && hours < 12 ? +hours + 12 : period === 'AM' && hours === '12' ? 0 : hours;
    return `${adjustedHours}:${minutes}`;
  };

  return (
    <div className="organizer-background">
      <div className="container">
        <nav className="organizer-nav">
          <button className="btn" onClick={() => navigate(`/rsvp-list/${userId}`)}>
            <FontAwesomeIcon icon={faList} /> RSVP List
          </button>
          <button className="btn" onClick={() => navigate('/event-management')}>
            <FontAwesomeIcon icon={faSearch} /> Event Management
          </button>
          <button className="btn" onClick={() => navigate('/organizer/task-management')}>
            <FontAwesomeIcon icon={faTasks} /> Task Management
          </button>
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
              value={convertTo24HourFormat(eventTime)} 
              onChange={(e) => setEventTime(convertTo12HourFormat(e.target.value))} 
              required 
            />
            <select
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
            >
              <option value="">Select Location</option>
              {venues.map((venue) => (
                <option key={venue._id} value={venue.name}>{venue.name}</option>
              ))}
            </select>
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
                <p><strong>Time:</strong> {convertTo12HourFormat(event.time)}</p>
                <p><strong>Location:</strong> {event.location ? event.location.name : 'No venue'}</p> {/* Display venue name */}
                <p><strong>Description:</strong> {event.description}</p>
                <input 
                  type="text" 
                  style={{ width: '300px' }} 
                  placeholder="Guest Emails (comma separated)" 
                  value={inviteInputs[event._id] || ''} // Use the event-specific value
                  onChange={(e) => handleInviteChange(event._id, e.target.value)} // Update the event-specific value
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
          <TaskManagement tasks={tasks} fetchTasks={fetchTasks} events={events} users={users} />
        </section>
        <footer>
          &copy; 2024 EventConnect. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default OrganizerInterface;
