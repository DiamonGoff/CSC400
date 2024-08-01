import React, { useState, useEffect } from 'react';
import Map from './Map';
import VenueCard from './VenueCard';
import './VenueSearch.css';

const VenueSearch = ({ setVenues }) => {
  const [location, setLocation] = useState('');
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [venues, setLocalVenues] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: location }),
      });
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setCenter({ lat, lng });
        fetchVenues(location);
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
    }
  };

  const fetchVenues = async (location) => {
    try {
      const response = await fetch(`/api/venues/search?location=${location}`);
      const data = await response.json();
      setVenues(data);
      setLocalVenues(data);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  useEffect(() => {
    // Optionally fetch initial venues here
  }, []);

  return (
    <div className="venue-search">
      <h2>Venue Search</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="results">
        <Map center={center} zoom={12} />
        <div className="venue-list">
          {venues.map((venue) => (
            <VenueCard key={venue.name} venue={venue} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueSearch;
