import React, { useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = ({ user }) => {
  const [name, setName] = useState(user?.name || '');
  const [contact, setContact] = useState(user?.contact || '');
  const [preferences, setPreferences] = useState(user?.preferences || '');
  const [venueTypes, setVenueTypes] = useState(user?.venueTypes || '');
  const [guestListPreferences, setGuestListPreferences] = useState(user?.guestListPreferences || '');
  const [invitationStyles, setInvitationStyles] = useState(user?.invitationStyles || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/profile', {
        name,
        contact,
        preferences,
        venueTypes,
        guestListPreferences,
        invitationStyles,
        email: user.email
      });
      setMessage('Profile updated successfully');
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., John Doe"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact Information (Email):</label>
          <input
            type="email"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="e.g., john.doe@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="preferences">Event Preferences:</label>
          <textarea
            id="preferences"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g., Prefer outdoor venues, like to have live music, etc."
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="venueTypes">Preferred Venue Types:</label>
          <input
            type="text"
            id="venueTypes"
            value={venueTypes}
            onChange={(e) => setVenueTypes(e.target.value)}
            placeholder="e.g., Outdoor, Banquet Hall, Beachside, etc."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="guestListPreferences">Guest List Management Preferences:</label>
          <input
            type="text"
            id="guestListPreferences"
            value={guestListPreferences}
            onChange={(e) => setGuestListPreferences(e.target.value)}
            placeholder="e.g., Max 50 guests, need RSVP, etc."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="invitationStyles">Invitation Styles:</label>
          <input
            type="text"
            id="invitationStyles"
            value={invitationStyles}
            onChange={(e) => setInvitationStyles(e.target.value)}
            placeholder="e.g., Digital, Print, Themed Invitations, etc."
            required
          />
        </div>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default Profile;
