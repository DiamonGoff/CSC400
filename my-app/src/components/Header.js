// src/components/Header.js
import React from 'react';
import './Header.css'; // Ensure you have this CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src="/eventconnect-logo.png" alt="EventConnect Logo" className="logo" />
        <h3>EventConnect</h3>
      </div>
      <nav>
        <a href="/login" className="login-button">Login</a>
      </nav>
    </header>
  );
};

export default Header;
