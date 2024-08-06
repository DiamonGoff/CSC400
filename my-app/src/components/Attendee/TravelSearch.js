import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TravelSearch.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons';

const transportationOptions = [
  { value: 'bus_station', label: 'Bus Station' },
  { value: 'subway_station', label: 'Subway Station' },
  { value: 'train_station', label: 'Train Station' },
  { value: 'bicycle_store', label: 'Biking' },
  { value: 'rideshare', label: 'Rideshare' },
  { value: 'walking', label: 'Walking' },
  { value: 'car_rental', label: 'Car Rental' }
];

const TravelSearch = ({ eventLocation, latitude, longitude }) => {
  const [date, setDate] = useState('');
  const [transportationType, setTransportationType] = useState(transportationOptions[0].value);
  const [transportationResults, setTransportationResults] = useState([]);
  const [lodgingResults, setLodgingResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!latitude || !longitude) {
      setError('Event location coordinates are missing.');
    }
  }, [latitude, longitude]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setTransportationResults([]);
    setLodgingResults([]);
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/travelSearch`, {
        params: {
          location: `${latitude},${longitude}`,
          type: transportationType
        },
      });
      setTransportationResults(response.data.transportation);
      setLodgingResults(response.data.lodging);
    } catch (error) {
      console.error('Error fetching data from backend', error);
      setError('An error occurred while fetching travel options.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="travel-search">
      <h2><FontAwesomeIcon icon={faSearchLocation} /> Travel Search</h2>
      <form onSubmit={handleSearch} className="travel-search-form">
        <input
          type="date"
          placeholder="Travel Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="form-input"
        />
        <select value={transportationType} onChange={(e) => setTransportationType(e.target.value)} required className="form-input">
          {transportationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit" className="search-button">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}
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
          !loading && <p>No transportation options found.</p>
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
          !loading && <p>No lodging options found.</p>
        )}
      </div>
    </div>
  );
};

export default TravelSearch;
