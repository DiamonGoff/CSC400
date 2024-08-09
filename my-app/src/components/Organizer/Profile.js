import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Profile.css';
import { UserContext } from '../../contexts/UserContext'; // Correct path to UserContext

const Profile = () => {
  const { user } = useContext(UserContext); // Ensure this line is correct
  const [profile, setProfile] = useState({
    name: '',
    contact: '',
    preferences: '',
    venueTypes: '',
    guestListPreferences: '',
    invitationStyles: '',
  });
  const [message, setMessage] = useState('');
  const [recommendedVenues, setRecommendedVenues] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3001/profile/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/profile/${user.id}`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile updated successfully');

      // Fetch recommended venues
      const venuesResponse = await axios.get('http://localhost:3001/venues/recommendations', {
        params: { preferences: profile.preferences, venueTypes: profile.venueTypes },
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecommendedVenues(venuesResponse.data);
    } catch (error) {
      setMessage('There was an error updating the profile!');
      console.error('There was an error updating the profile!', error);
    }
  };

  return (
    <div className="profile-container">
      <h2>Create Your Profile</h2>
      {message && <div className="confirmation-message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="e.g., John Doe"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact Information (Email):</label>
          <input
            type="email"
            id="contact"
            value={profile.contact}
            onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
            placeholder="e.g., john.doe@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="preferences">Event Preferences:</label>
          <textarea
            id="preferences"
            value={profile.preferences}
            onChange={(e) => setProfile({ ...profile, preferences: e.target.value })}
            placeholder="e.g., Prefer outdoor venues, like to have live music, etc."
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="venueTypes">Preferred Venue Types:</label>
          <input
            type="text"
            id="venueTypes"
            value={profile.venueTypes}
            onChange={(e) => setProfile({ ...profile, venueTypes: e.target.value })}
            placeholder="e.g., Outdoor, Banquet Hall, Beachside, etc."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="guestListPreferences">Guest List Management Preferences:</label>
          <input
            type="text"
            id="guestListPreferences"
            value={profile.guestListPreferences}
            onChange={(e) => setProfile({ ...profile, guestListPreferences: e.target.value })}
            placeholder="e.g., Max 50 guests, need RSVP, etc."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="invitationStyles">Invitation Styles:</label>
          <input
            type="text"
            id="invitationStyles"
            value={profile.invitationStyles}
            onChange={(e) => setProfile({ ...profile, invitationStyles: e.target.value })}
            placeholder="e.g., Digital, Print, Themed Invitations, etc."
            required
          />
        </div>
        <button type="submit">Save Profile</button>
      </form>

      <h2>Places You May Like</h2>
      <div className="recommended-venues">
        {recommendedVenues.map((venue) => (
          <div key={venue.id} className="venue-card">
            <h3>{venue.name}</h3>
            <p>{venue.address}</p>
            <p>{venue.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
