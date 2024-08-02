import React, { useState } from 'react';
import axios from 'axios';
import './TravelSearch.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons';

// Predefined transportation options
const transportationOptions = [
  { value: 'bus_station', label: 'Bus Station' },
  { value: 'subway_station', label: 'Subway Station' },
  { value: 'train_station', label: 'Train Station' },
  { value: 'bicycle_store', label: 'Biking' },
  { value: 'rideshare', label: 'Rideshare' },
  { value: 'walking', label: 'Walking' },
  { value: 'car_rental', label: 'Car Rental' }
];

// Functional component to handle travel search functionality
const TravelSearch = ({ eventLocation }) => {
  const [date, setDate] = useState(''); // State for travel date input
  const [transportationType, setTransportationType] = useState(transportationOptions[0].value); // State for selected transportation type
  const [transportationResults, setTransportationResults] = useState([]); // State for storing transportation search results
  const [lodgingResults, setLodgingResults] = useState([]); // State for storing lodging search results
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(''); // State for error message

  // Function to handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Reset error state
    setTransportationResults([]); // Reset transportation results
    setLodgingResults([]); // Reset lodging results
    setLoading(true); // Set loading state to true
    try {
      // Make an API request to the backend for travel search
      const response = await axios.get(`http://localhost:3001/travelSearch`, {
        params: {
          location: eventLocation, // Event location in "latitude,longitude" format
          type: transportationType // Selected transportation type
        },
      });
      // Update state with the fetched results
      setTransportationResults(response.data.transportation);
      setLodgingResults(response.data.lodging);
    } catch (error) {
      console.error('Error fetching data from backend', error); // Log error to console
      setError('An error occurred while fetching travel options.'); // Set error message
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="travel-search">
      <h2><FontAwesomeIcon icon={faSearchLocation} /> Travel Search</h2>
      <form onSubmit={handleSearch}>
        <input
          type="date"
          placeholder="Travel Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select value={transportationType} onChange={(e) => setTransportationType(e.target.value)} required>
          {transportationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit">Search</button>
      </form>
      {error && <p className="error">{error}</p>} {/* Display error message if any */}
      {loading && <p className="loading">Loading...</p>} {/* Display loading message if loading */}
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
