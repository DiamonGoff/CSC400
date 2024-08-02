import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from the server
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:3001/notifications', {
          withCredentials: true // Include credentials with the request
        });
        setNotifications(response.data); // Update state with the fetched notifications
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
            <span>{new Date(notification.timestamp).toLocaleString()}</span> {/* Display the timestamp */}
            <p>{notification.message}</p> {/* Display the notification message */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
