import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import './Dashboard.css';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
    } else {
      const fetchEvents = async () => {
        try {
          console.log('Fetching events for user:', user.email);
          const response = await axiosInstance.get(`/users/${user.email}/events`, {
            headers: { Authorization: localStorage.getItem('token') }
          });
          console.log('Fetched events:', response.data);
          setEvents(response.data);
        } catch (error) {
          console.error('Error fetching events', error);
        }
      };
      fetchEvents();
    }
  }, [user, navigate]);

  const handleEventSelection = (eventId) => {
    console.log('Event selected:', eventId);
    navigate(`/attendee/${eventId}`);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard, {user.name}!</h1>
        <p>Select the event you would like to access</p>
      </header>
      <section className="events-section">
        <h2>Your Events</h2>
        {events.length > 0 ? (
          <ul className="events-list">
            {events.map((event) => (
              <li key={event._id} className="event-item" onClick={() => handleEventSelection(event._id)}>
                <div className="event-details">
                  <h3>{event.name}</h3>
                  <p>{new Date(event.date).toLocaleString()}</p>
                  <p>{event.location.name}</p>
                </div>
                <Link to={`/attendee/${event._id}`} className="btn btn-primary">
                  View Event
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events found.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
