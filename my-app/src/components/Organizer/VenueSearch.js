// components/VenueSearch.js
import React, { useState } from 'react';
import Map from './Map';

const VenueSearch = () => {
  const [location, setLocation] = useState('');
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default center (San Francisco)
  const [zoom, setZoom] = useState(12);

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
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
    }
  };

  return (
    <div className="venue-search">
      <h2>Venue Search</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="results">
        <Map center={center} zoom={zoom} />
      </div>
    </div>
  );
};

export default VenueSearch;
