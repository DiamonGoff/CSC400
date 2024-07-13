// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Ensure you have styling for your form

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/auth/signup', {
        name,
        email,
        password
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(`Error registering user: ${error.response.data.message || error.message}`);
    }
  };

  return (
    <div className="register-box">
      <h2 className="text-center">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name or Nickname:</label>
          <input 
            type="text" 
            className="form-control" 
            id="name" 
            name="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="confirm_password">Confirm Password:</label>
          <input 
            type="password" 
            className="form-control" 
            id="confirm_password" 
            name="confirm_password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </div>
        <input type="submit" value="Sign Up" className="btn btn-primary btn-block" />
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
