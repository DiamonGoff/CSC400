// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; // Use the configured Axios instance
import './Login.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState(''); // Add welcome message state
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      setMessage(response.data.message);
      setUser(response.data.user);
      localStorage.setItem('userId', response.data.user._id);
      setWelcomeMessage(`Welcome back, ${response.data.user.name}!`); // Set the welcome message
      navigate('/'); // Navigate to home or any other route
    } catch (error) {
      setMessage(`Error logging in: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      {welcomeMessage && <p className="welcome-message">{welcomeMessage}</p>} {/* Display the welcome message */}
    </div>
  );
}

export default Login;
