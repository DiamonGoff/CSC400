import React, { useState } from 'react';
import axios from 'axios';
import './TravelSearch.css';

const TravelSearch = ({ eventLocation }) => {
  const [date, setDate] = useState('');
  const [transportationResults, setTransportationResults] = useState([]);
  const [lodgingResults, setLodgingResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setTransportationResults([]);
    setLodgingResults([]);
    try {
      const response = await axios.get(`http://localhost:3001/travelSearch`, {
        params: {
          location: eventLocation, // Format: "latitude,longitude"
        },
      });
      setTransportationResults(response.data.transportation);
      setLodgingResults(response.data.lodging);
    } catch (error) {
      console.error('Error fetching data from backend', error);
      setError('An error occurred while fetching travel options.');
    }
  };

  return (
    <div className="travel-search">
      <h2>Travel Search</h2>
      <form onSubmit={handleSearch}>
        <input
          type="date"
          placeholder="Travel Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="results">
        <h3>Transportation Options</h3>
        {transportationResults.length > 0 ? (
          transportationResults.map((result, index) => (
            <div key={index} className="result-item">
              <h4>{result.name}</h4>
              <p>{result.vicinity}</p>
            </div>
          ))
        ) : (
          !error && <p>No transportation options found.</p>
        )}
        <h3>Lodging Options</h3>
        {lodgingResults.length > 0 ? (
          lodgingResults.map((result, index) => (
            <div key={index} className="result-item">
              <h4>{result.name}</h4>
              <p>{result.vicinity}</p>
            </div>
          ))
        ) : (
          !error && <p>No lodging options found.</p>
        )}
      </div>
    </div>
  );
};

export default TravelSearch;
