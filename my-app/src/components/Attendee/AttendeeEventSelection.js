import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

function AttendeeEventSelection({ events, setEventId }) {
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userEmail}/events`);
        setEventId(response.data._id); // Ensure the eventId is set
      } catch (error) {
        console.error('There was an error fetching the events!', error);
      }
    };
    if (userEmail) {
      fetchEvents();
    }
  }, [userEmail, setEventId]);

  return (
    <div className="event-selection">
      <h1>Select an Event</h1>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <Link to={`/attendee/${event._id}`}>{event.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttendeeEventSelection;
