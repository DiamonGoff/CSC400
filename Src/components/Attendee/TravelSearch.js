import React from 'react';

const TravelSearch = () => {
  return (
    <div className="travel-search">
      <h2>Travel Search</h2>
      <form>
        <input type="text" placeholder="Departure Location" />
        <input type="text" placeholder="Destination" />
        <input type="date" placeholder="Travel Date" />
        <button type="submit">Search</button>
      </form>
      <div className="results">
        {/* List of transportation options */}
      </div>
    </div>
  );
};

export default TravelSearch;
