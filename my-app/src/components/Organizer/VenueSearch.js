import React from 'react';

const VenueSearch = () => {
  return (
    <div className="venue-search">
      <h2>Venue Search</h2>
      <form>
        <input type="text" placeholder="Location" />
        <input type="number" placeholder="Capacity" />
        <input type="text" placeholder="Amenities" />
        <input type="number" placeholder="Budget" />
        <button type="submit">Search</button>
      </form>
      <div className="results">
        {/* Map and List of venues will be displayed here */}
      </div>
    </div>
  );
};

export default VenueSearch;
