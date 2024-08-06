import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const HotelCard = ({ hotel, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(hotel.isFavorite);

  useEffect(() => {
    setIsFavorite(hotel.isFavorite); // Ensure the favorite state is in sync with the prop
  }, [hotel]);

  const handleFavoriteClick = async () => {
    if (!hotel || !hotel.place_id) {
      console.error('hotel.place_id is undefined or hotel is not defined');
      return;
    }
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    try {
      if (newFavoriteStatus) {
        await axios.post('http://localhost:3001/favorites/add', { hotelId: hotel.place_id });
      } else {
        await axios.post('http://localhost:3001/favorites/remove', { hotelId: hotel.place_id });
      }
      onFavoriteChange();
    } catch (error) {
      console.error('Failed to update favorite status', error);
      setIsFavorite(!newFavoriteStatus); // Revert state on error
    }
  };

  const handleDeleteClick = async () => {
    if (!hotel || !hotel.place_id) {
      console.error('hotel.place_id is undefined or hotel is not defined');
      return;
    }
    try {
      await axios.delete(`http://localhost:3001/favorites/${hotel.place_id}`);
      onFavoriteChange();
    } catch (error) {
      console.error('Failed to delete favorite hotel', error);
    }
  };

  if (!hotel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="venue-card">
      <h3>{hotel.name}</h3>
      <p><strong>Address:</strong> {hotel.vicinity || 'N/A'}</p>
      <p><strong>Phone:</strong> {hotel.phone || 'N/A'}</p>
      <p><strong>Website:</strong> <a href={hotel.website || '#'} target="_blank" rel="noopener noreferrer">{hotel.website || 'N/A'}</a></p>
      <p><strong>Rating:</strong> {hotel.rating || 'N/A'}</p>
      <p><strong>Distance:</strong> {hotel.distance.toFixed(2)} miles</p>
      <div>
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
    </div>
  );
};

export default HotelCard;
