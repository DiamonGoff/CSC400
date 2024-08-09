import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './EventManagement.css';

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [giftSuggestions, setGiftSuggestions] = useState([]);
  const [newGiftSuggestion, setNewGiftSuggestion] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchGiftSuggestions(selectedEventId);
    }
  }, [selectedEventId]);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('There was an error fetching the events!', error);
    }
  };

  const fetchGiftSuggestions = async (eventId) => {
    try {
      const response = await axiosInstance.get(`/gift-suggestions/${eventId}`);
      setGiftSuggestions(response.data);
    } catch (error) {
      console.error('There was an error fetching the gift suggestions!', error);
    }
  };

  const handleAddGiftSuggestion = async () => {
    try {
      const response = await axiosInstance.post(`/gift-suggestions/${selectedEventId}`, { suggestion: newGiftSuggestion });
      setGiftSuggestions([...giftSuggestions, response.data]);
      setNewGiftSuggestion('');
      setMessage('Gift suggestion added successfully');
    } catch (error) {
      setMessage('There was an error adding the gift suggestion!');
      console.error('Error adding gift suggestion:', error);
    }
  };

  const handleDeleteGiftSuggestion = async (id) => {
    try {
      await axiosInstance.delete(`/gift-suggestions/${selectedEventId}/${id}`);
      setGiftSuggestions(giftSuggestions.filter(suggestion => suggestion._id !== id));
      setMessage('Gift suggestion deleted successfully');
    } catch (error) {
      setMessage('There was an error deleting the gift suggestion!');
      console.error('Error deleting gift suggestion:', error);
    }
  };

  return (
    <div className="event-management">
      <h2>Event Management</h2>
      {message && <div className="message">{message}</div>}

      <section>
        <h3>Select an Event</h3>
        <select onChange={(e) => setSelectedEventId(e.target.value)} value={selectedEventId}>
          <option value="">Select an Event</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>{event.name}</option>
          ))}
        </select>
      </section>

      {selectedEventId && (
        <section>
          <h3>Gift Suggestions for Selected Event</h3>
          <ul>
            {giftSuggestions.map((suggestion) => (
              <li key={suggestion._id}>
                {suggestion.suggestion}
                <div className="button-container">
                  <button className="delete-button" onClick={() => handleDeleteGiftSuggestion(suggestion._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newGiftSuggestion}
            onChange={(e) => setNewGiftSuggestion(e.target.value)}
            placeholder="Add a new gift suggestion"
          />
          <button onClick={handleAddGiftSuggestion}>Add Suggestion</button>
        </section>
      )}
    </div>
  );
}

export default EventManagement;
