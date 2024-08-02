import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const VenueCard = ({ venue, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(venue.isFavorite);

  useEffect(() => {
    setIsFavorite(venue.isFavorite); // Ensure the favorite state is in sync with the prop
  }, [venue]);

  const handleFavoriteClick = async () => {
    if (!venue || !venue._id) {
      console.error('venue._id is undefined or venue is not defined');
      return;
    }
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    try {
      if (newFavoriteStatus) {
        await axios.post('http://localhost:3001/favorites/add', { venueId: venue._id });
      } else {
        await axios.post('http://localhost:3001/favorites/remove', { venueId: venue._id });
      }
      onFavoriteChange();
    } catch (error) {
      console.error('Failed to update favorite status', error);
      setIsFavorite(!newFavoriteStatus); // Revert state on error
    }
  };

  const handleDeleteClick = async () => {
    if (!venue || !venue._id) {
      console.error('venue._id is undefined or venue is not defined');
      return;
    }
    try {
      await axios.delete(`http://localhost:3001/favorites/${venue._id}`);
      onFavoriteChange();
    } catch (error) {
      console.error('Failed to delete favorite venue', error);
    }
  };

  if (!venue) {
    return <div>Loading...</div>;
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
        onClick={handleDeleteClick}
        style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }}
      />
    </div>
  );
};

export default VenueCard;
