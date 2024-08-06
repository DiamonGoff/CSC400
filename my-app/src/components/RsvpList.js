import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import './RsvpList.css';

const RsvpList = ({ fetchRSVPList }) => {
  const { userId } = useParams();
  const [rsvpLists, setRsvpLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getRsvpLists = async () => {
      try {
        const data = await fetchRSVPList(userId);
        setRsvpLists(data);
      } catch (err) {
        setError('Failed to fetch RSVP lists');
      } finally {
        setLoading(false);
      }
    };

    getRsvpLists();
  }, [userId, fetchRSVPList]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="rsvp-list-container">
      <h2>RSVP Lists for Each Event</h2>
      {rsvpLists.length === 0 ? (
        <p className="no-rsvp-message">No RSVP lists found</p>
      ) : (
        rsvpLists.map((rsvpList) => (
          <div key={rsvpList.eventId} className="rsvp-item">
            <h3 className="event-name">RSVP list for {rsvpList.eventName}</h3>
            <ul className="rsvp-ul">
              {rsvpList.rsvps.map((rsvp) => (
                <li key={rsvp.attendeeId._id} className="rsvp-li">
                  <span>
                    <span className="attendee-name">{rsvp.attendeeName}</span> 
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default RsvpList;
