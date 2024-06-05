import React from 'react';

const LodgingSearch = () => {
  return (
    <div className="lodging-search">
      <h2>Lodging Search</h2>
      <form>
        <input type="text" placeholder="Location" />
        <input type="date" placeholder="Check-in Date" />
        <input type="date" placeholder="Check-out Date" />
        <input type="number" placeholder="Guests" />
        <button type="submit">Search</button>
      </form>
      <div className="results">
        {/* List of lodging options */}
      </div>
    </div>
  );
};

export default LodgingSearch;
