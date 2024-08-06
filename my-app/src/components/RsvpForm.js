import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const RsvpForm = ({ eventId }) => {
  const [response, setResponse] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(`/events/${eventId}/rsvp`, { response });
      setMessage('RSVP saved successfully');
    } catch (error) {
      setMessage('Error saving RSVP');
      console.error('Error saving RSVP:', error);
    }
  };

  return (
    <div>
      <h3>RSVP to Event</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Your Response:
          <input type="text" value={response} onChange={(e) => setResponse(e.target.value)} required />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RsvpForm;
