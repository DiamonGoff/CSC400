import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const Header = ({ user, setUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const response = await axiosInstance.get('/notifications');
          setNotifications(response.data);
        } catch (error) {
          console.error('Error fetching notifications', error);
        }
      };
      fetchNotifications();
    }
  }, [user]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img src="/eventconnect-logo.png" alt="EventConnect Logo" className="logo" />
        </Link>
        <h3>EventConnect</h3>
      </div>
      <nav>
        {user ? (
          <>
            <span className="welcome-message">Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
            <div className="notifications-dropdown">
              <FontAwesomeIcon icon={faBell} onClick={toggleDropdown} className="notifications-icon" />
              {isDropdownOpen && (
                <div className="notifications-dropdown-content">
                  {notifications.length > 0 ? (
                    <ul>
                      {notifications.map((notification) => (
                        <li key={notification._id}>
                          <span>{new Date(notification.createdAt).toLocaleString()}</span>
                          <p>{notification.message}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-notifications">No Notifications yet</p>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="login-button">Login</Link>
            <Link to="/register" className="signup-button">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
