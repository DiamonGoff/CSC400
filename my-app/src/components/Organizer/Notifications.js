import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:3001/notifications', {
          withCredentials: true
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-dropdown">
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>
            <span>{new Date(notification.timestamp).toLocaleString()}</span>
            <p>{notification.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
