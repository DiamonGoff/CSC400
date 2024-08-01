import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const VenueCard = ({ venue, onFavoriteChange, handleDeleteClick }) => {
  const [isFavorite, setIsFavorite] = useState(venue.isFavorite);

  useEffect(() => {
    console.log('VenueCard mounted with venue:', venue);
    setIsFavorite(venue.isFavorite); // Ensure the favorite state is in sync with the prop
  }, [venue]);

  const handleFavoriteClick = async () => {
    if (!venue || !venue.name) {
      console.error('venue.name is undefined or venue is not defined');
      return;
    }
    console.log(`Attempting to update favorite status for venue: ${venue.name}`);
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    try {
      if (newFavoriteStatus) {
        console.log(`Adding favorite venue: ${venue.name}`);
        await axios.post('http://localhost:3001/favorites/add', { venueName: venue.name });
      } else {
        console.log(`Removing favorite venue: ${venue.name}`);
        await axios.post('http://localhost:3001/favorites/remove', { venueName: venue.name });
      }
      onFavoriteChange();
    } catch (error) {
      console.error('Failed to update favorite status', error);
    }
  };

  if (!venue || !venue.name) {
    console.error('Invalid venue data:', venue); // Log the invalid venue data
    return <div>Invalid venue data</div>;
  }

  return (
    <div className="venue-card">
      <h3>{venue.name}</h3>
      <p><strong>Address:</strong> {venue.address || 'N/A'}</p>
      <p><strong>Capacity:</strong> {venue.capacity || 'N/A'}</p>
      <p><strong>Amenities:</strong> {Array.isArray(venue.amenities) ? venue.amenities.join(', ') : 'N/A'}</p>
      <p><strong>Price:</strong> {venue.price || 'N/A'}</p>
      <p><strong>Phone:</strong> {venue.phone || 'N/A'}</p>
      <p><strong>Website:</strong> <a href={venue.website || '#'} target="_blank" rel="noopener noreferrer">{venue.website || 'N/A'}</a></p>
      <FontAwesomeIcon
        icon={faStar}
        onClick={handleFavoriteClick}
        style={{ color: isFavorite ? 'gold' : 'gray', cursor: 'pointer' }}
      />
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() => handleDeleteClick(venue._id)}
        style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }}
      />
    </div>
  );
};

export default VenueCard;
