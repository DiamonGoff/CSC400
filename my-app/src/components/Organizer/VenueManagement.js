import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VenueCard from './VenueCard';
import './VenueManagement.css';

const VenueManagement = ({ user }) => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${user._id}/favorites`);
      console.log('Fetched Favorites:', response.data.favoriteVenues);
      setFavorites(response.data.favoriteVenues);
    } catch (error) {
      console.error('There was an error fetching favorite venues!', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const handleDeleteClick = async (venueId) => {
    try {
      await axios.delete(`http://localhost:3001/users/${user._id}/favorites/${venueId}`);
      fetchFavorites(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete favorite venue', error);
    }
  };

  return (
    <div className="venue-management">
      <h2>Favorite Venues</h2>
      <div className="venue-list">
        {favorites.length > 0 ? (
          favorites.map((venue) => (
            <VenueCard
              key={venue._id}
              venue={venue}
              isFavorite={true}
              onFavoriteChange={fetchFavorites}
              handleDeleteClick={() => handleDeleteClick(venue._id)}
            />
          ))
        ) : (
          <p>No favorite venues found.</p>
        )}
      </div>
    </div>
  );
};

export default VenueManagement;
