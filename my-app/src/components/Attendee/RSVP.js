import React from 'react';

const RSVP = () => {
  return (
    <div className="rsvp">
      <br />
      <br />
      <h2>RSVP</h2>
      <form>
        <input type="text" placeholder="Your Name" />
        <input type="email" placeholder="Your Email" />
        <button type="submit">RSVP</button>
      </form>
      <div className="attendees-list">
        {/* List of attendees who have RSVP'd */}
      </div>
    </div>
  );
};

export default RSVP;
