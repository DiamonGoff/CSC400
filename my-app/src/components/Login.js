import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; // Use the configured Axios instance
import './Login.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
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
      localStorage.setItem('token', response.data.token); // Store the token in localStorage
      navigate('/'); // Navigate to home or any other route
    } catch (error) {
      setMessage(`Error logging in: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="register-box">
      <h2 className="text-center">Login</h2>
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
        <input type="submit" value="Login" className="btn btn-primary btn-block" />
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
