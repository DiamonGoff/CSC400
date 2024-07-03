import React, { useState } from 'react';
import './RSVP.css';
import axios from 'axios';

function RSVP() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // State for the confirmation message

  const handleRSVP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/rsvp', {
        name: name,
        email: email,
      });
      setMessage('RSVP successful!'); // Set the confirmation message
      console.log(response.data);
      // Clear form inputs
      setName('');
      setEmail('');
    } catch (error) {
      setMessage('There was an error submitting your RSVP!');
      console.error('There was an error submitting your RSVP!', error);
    }
  };

  return (
    <div className="rsvp-container">
      <h2>RSVP</h2>
      {message && <div className="confirmation-message">{message}</div>} {/* Display the confirmation message */}
      <form onSubmit={handleRSVP}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
}

export default RSVP;
