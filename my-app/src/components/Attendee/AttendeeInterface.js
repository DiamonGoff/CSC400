import React from 'react';
import RSVP from './RSVP';
import GiftIdeas from './GiftIdeas';
import Sharing from './Sharing';
import './AttendeeInterface.css'; // Import the CSS file for styling

const AttendeeInterface = () => {
  return (
    <div className="attendee-interface">
      <header>
        <h1>Birthday Party Planner - Attendee Interface</h1>
      </header>
      <main>
        <section id="rsvp">
          <RSVP />
        </section>
        <section id="gift-ideas">
          <GiftIdeas />
        </section>
        <section id="sharing">
          <Sharing />
        </section>
      </main>
      <footer>
        <p>© 2024 Birthday Party Planner</p>
      </footer>
    </div>
  );
};

export default AttendeeInterface;
