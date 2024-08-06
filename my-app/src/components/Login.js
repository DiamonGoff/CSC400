import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import './Login.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('organizer'); // Default role
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
        role // Send role with the login request
      });

      console.log('Login response:', response);

      setMessage(response.data.message);
      setUser(response.data.user);
      localStorage.setItem('token', `Bearer ${response.data.token}`); // Store the token with 'Bearer ' prefix
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store the user object
      localStorage.setItem('userId', response.data.user._id); // Store the userId

      axiosInstance.defaults.headers['Authorization'] = response.data.token; // Update axios instance with new token

      // Redirect based on role
      if (response.data.user.role === 'organizer') {
        navigate('/organizer');
      } else if (response.data.user.role === 'attendee') {
        navigate('/dashboard'); // Redirect to the new dashboard
      }
    } catch (error) {
      console.log('Login error:', error);
      setMessage(`Error logging in: ${error.response?.data?.message || error.message}`);
    }
  };

  const toggleRole = () => {
    setRole((prevRole) => (prevRole === 'organizer' ? 'attendee' : 'organizer'));
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
        <button type="button" onClick={toggleRole} className="btn btn-secondary btn-block">
          Toggle Role (Current: {role})
        </button>
        <input type="submit" value="Login" className="btn btn-primary btn-block" />
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
