import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id} className={`notification ${notification.priority}`}>
            <span>{new Date(notification.timestamp).toLocaleString()}</span>
            <p>{notification.message}</p>
            <button>Mark as Read</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
