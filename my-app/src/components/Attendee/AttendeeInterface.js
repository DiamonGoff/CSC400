import React, { useState, useEffect, useCallback } from 'react';
import './AttendeeInterface.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faShareAlt, faPlane, faEnvelope, faCar, faBus, faWalking, faBiking, faHotel } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate, useParams, Link } from 'react-router-dom';
import MapComponent from './MapComponent';
import HotelCard from './HotelCard';

const travelModes = {
  driving: 'DRIVING',
  transit: 'TRANSIT',
  walking: 'WALKING',
  bicycling: 'BICYCLING',
};

function AttendeeInterface() {
  const { eventId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState('yes');
  const [message, setMessage] = useState('');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [departure, setDeparture] = useState(' ');
  const [travelDetails, setTravelDetails] = useState(null);
  const [travelError, setTravelError] = useState('');
  const [travelMode, setTravelMode] = useState(travelModes.driving);
  const [hotels, setHotels] = useState([]);
  const [hotelError, setHotelError] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState(10); // Default filter set to 10 miles
  const [giftSuggestions, setGiftSuggestions] = useState([]); // New state for gift suggestions
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');

  const fetchEvent = useCallback(async () => {
    try {
      console.log('Fetching event details for event ID:', eventId);
      const response = await axiosInstance.get(`/events/${eventId}`);
      console.log('Full fetched event response:', response.data); // Log full response
      setEvent(response.data);
      setLoading(false);

      if (response.data.location) {
        const lat = response.data.location.lat;
        const lng = response.data.location.lng;
        console.log('Latitude:', lat, 'Longitude:', lng); // Log lat and lng
        fetchHotels(lat, lng); // Fetch hotels when event data is fetched
      } else {
        console.error('Event location is missing');
      }
    } catch (error) {
      console.error('There was an error fetching the event details!', error);
      setLoading(false);
    }
  }, [eventId]);

  const fetchGiftSuggestions = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/gift-suggestions/${eventId}`);
      setGiftSuggestions(response.data);
    } catch (error) {
      console.error('There was an error fetching the gift suggestions!', error);
    }
  }, [eventId]);

  const fetchEvents = useCallback(async () => {
    try {
      console.log('Fetching events for user email:', userEmail);
      const response = await axiosInstance.get(`/users/${userEmail}/events`);
      setEvents(response.data);
      console.log('Fetched events:', response.data);
    } catch (error) {
      console.error('There was an error fetching the events!', error);
    }
  }, [userEmail]);

  const fetchHotels = async (lat, lng) => {
    console.log('Fetching hotels for lat:', lat, 'lng:', lng); // Log the lat and lng values

    try {
      const response = await axiosInstance.get('/api/hotels', {
        params: { lat, lng }
      });
      console.log('Fetched hotels:', response.data); // Log the response data
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotel data', error);
      setHotelError('Error fetching hotel data');
    }
  };

  const fetchTravelDetails = async (mode) => {
    try {
      console.log('Fetching travel details with mode:', mode);
      const response = await axiosInstance.get('/api/travelModes/directions', {
        params: {
          origin: departure,
          destination: event ? `${event.location.lat},${event.location.lng}` : '',
          mode: mode // Ensure mode is passed correctly
        },
      });

      console.log('Fetched travel details:', response.data); // Log full response
      setTravelDetails(response.data);
      setTravelError('');
    } catch (err) {
      setTravelError('An error occurred while fetching travel details.');
      console.error('Error fetching travel details:', err);
    }
  };

  useEffect(() => {
    if (!userId) {
      console.error('User ID is missing, redirecting to login');
      navigate('/login');
    } else if (eventId) {
      fetchEvent();
      fetchGiftSuggestions(); // Fetch gift suggestions when event ID is available
    } else {
      fetchEvents();
    }
  }, [userId, navigate, eventId, fetchEvent, fetchEvents, fetchGiftSuggestions]);

  useEffect(() => {
    console.log('Event details:', event);
    if (event && event.location) {
      console.log('Event location:', event.location);
    }
  }, [event]);

  const handleRSVP = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/events/${eventId}/rsvp`, {
        attendeeId: userId,
        attendeeName: name,
        attendeeEmail: email,
        response
      });
      setMessage('RSVP successful');
      setName('');
      setEmail('');
    } catch (error) {
      console.error('There was an error submitting the RSVP!', error);
      setMessage('There was an error submitting the RSVP!');
    }
  };

  const handleSocialShare = (platform) => {
    const url = window.location.href;
    const text = 'Check out this birthday event!';
    let shareUrl = '';

    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    }

    window.open(shareUrl, '_blank');
  };

  const handleTravelSearch = async (e) => {
    e.preventDefault();
    fetchTravelDetails(travelMode); // Use travelMode here
  };

  const handleTravelModeChange = (mode) => {
    setTravelMode(mode);
    fetchTravelDetails(mode); // Use mode here to fetch travel details
  };

  const handleFavoriteChange = (hotel) => {
    setHotels((prevHotels) =>
      prevHotels.map((h) =>
        h.place_id === hotel.place_id ? { ...h, isFavorite: !h.isFavorite } : h
      )
    );
  };

  const filteredHotels = hotels.filter(hotel => hotel.distance <= distanceFilter);

  return (
    <div className="attendee-background">
      <div className="container">
        {!eventId ? (
          <>
            <header className="header">
              <h1>Welcome</h1>
              <p>Click the event you would like to access</p>
            </header>
            <div className="event-selection">
              <h1>Select an Event</h1>
              <ul>
                {events.map(event => (
                  <li key={event._id} className="event-item">
                    <div className="event-details">
                      <h3>{event.name}</h3>
                      <p>{new Date(event.date).toLocaleString()}</p>
                      <p>{event.location.name}</p> {/* Display venue name */}
                    </div>
                    <Link to={`/attendee/${event._id}`} className="btn btn-primary">
                      View Event
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            {loading ? (
              <p>Loading event details...</p>
            ) : (
              event && (
                <>
                  <section>
                    <h1>Welcome, you have been invited to {event.name}</h1>
                  </section>
                  <section>
                    <br />
                    <h2><FontAwesomeIcon icon={faEnvelope} /> RSVP</h2>
                    <form onSubmit={handleRSVP}>

                      <select
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="maybe">Maybe</option>
                      </select>
                      <button type="submit">RSVP</button>
                    </form>
                    {message && <p>{message}</p>}
                  </section>
                  <section>
                    <h2><FontAwesomeIcon icon={faGift} /> Gift Ideas</h2>
                    <p>Explore the best gift ideas for the birthday event.</p>
                    <div className="gift-suggestions">
                      {giftSuggestions.length > 0 ? (
                        giftSuggestions.map(suggestion => (
                          <div key={suggestion._id} className="gift-suggestion">
                            <FontAwesomeIcon icon={faGift} /> {suggestion.suggestion}
                          </div>
                        ))
                      ) : (
                        <p>No gift ideas available for this event.</p>
                      )}
                    </div>
                  </section>
                  <section>
                    <h2><FontAwesomeIcon icon={faShareAlt} /> Social Interaction</h2>
                    <p>Share the event details on social media and interact with other attendees.</p>
                    <button className="btn social-btn facebook" onClick={() => handleSocialShare('facebook')}>Share on Facebook</button>
                    <button className="btn social-btn twitter" onClick={() => handleSocialShare('twitter')}>Share on X</button>
                  </section>
                  <section>
                    <h2><FontAwesomeIcon icon={faPlane} /> Find Your Way To The Venue</h2>
                    <form onSubmit={handleTravelSearch}>
                      <input
                        type="text"
                        placeholder="Enter your departure location"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        required
                      />
                      <button type="submit">Search</button>
                    </form>
                    <div className="travel-modes">
                      <button onClick={() => handleTravelModeChange(travelModes.driving)}><FontAwesomeIcon icon={faCar} /></button>
                      <button onClick={() => handleTravelModeChange(travelModes.transit)}><FontAwesomeIcon icon={faBus} /></button>
                      <button onClick={() => handleTravelModeChange(travelModes.walking)}><FontAwesomeIcon icon={faWalking} /></button>
                      <button onClick={() => handleTravelModeChange(travelModes.bicycling)}><FontAwesomeIcon icon={faBiking} /></button>
                    </div>
                    {travelError && <p className="error">{travelError}</p>}
                    {travelDetails && travelDetails.routes && travelDetails.routes.length > 0 ? (
                      <div className="travel-details">
                        <h3>Travel Details</h3>
                        <p>Distance from {event.location.name}: {travelDetails.routes[0].legs[0].distance.text}</p>
                        <p>Duration: {travelDetails.routes[0].legs[0].duration.text}</p>
                        <MapComponent
                          center={travelDetails.routes[0].legs[0].start_location}
                          zoom={10}
                          directions={travelDetails}
                          venueName={event.location.name} // Pass venue name correctly here
                        />
                      </div>
                    ) : (
                      <p>No route available for the selected travel mode.</p>
                    )}
                  </section>
                  <section>
                    <h2><FontAwesomeIcon icon={faHotel} /> Hotel Suggestions Near {event.location.name}</h2>
                    <label>
                      Distance Filter (miles):
                      <input
                        type="number"
                        value={distanceFilter}
                        onChange={(e) => setDistanceFilter(e.target.value)}
                      />
                    </label>
                    {hotelError && <p className="error">{hotelError}</p>}
                    <div className="venue-list">
                      {filteredHotels.length > 0 ? (
                        filteredHotels.map((hotel) => (
                          <HotelCard key={hotel.place_id} hotel={hotel} onFavoriteChange={handleFavoriteChange} />
                        ))
                      ) : (
                        <p>No hotels found within {distanceFilter} miles</p>
                      )}
                    </div>
                  </section>
                </>
              )
            )}
          </>
        )}
        <footer>
          &copy; 2024 EventConnect. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default AttendeeInterface;
