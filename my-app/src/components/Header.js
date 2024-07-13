// src/components/Header.js
import React from 'react';
import './Header.css'; // Ensure you have this CSS file for styling
import { Link } from 'react-router-dom';

const Header = ({ user }) => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src="/eventconnect-logo.png" alt="EventConnect Logo" className="logo" />
        <h3>EventConnect</h3>
      </div>
      <nav>
        {user ? (
          <span>Welcome, {user.name}!</span>
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
