import React from 'react';
import VenueCard from './VenueCard';

const VenueList = ({ venues, onFavoriteChange }) => {
  if (!venues || venues.length === 0) {
    return <div>No venues found</div>;
  }

  return (
    <div className="venue-list">
      {venues.map((venue) => (
        <VenueCard key={venue._id} venue={venue} onFavoriteChange={onFavoriteChange} />
      ))}
    </div>
  );
};

export default VenueList;
