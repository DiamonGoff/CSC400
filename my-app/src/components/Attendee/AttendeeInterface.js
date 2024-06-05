import React from 'react';
import TravelSearch from './TravelSearch';
import LodgingSearch from './LodgingSearch';
import Sharing from './Sharing';

const AttendeeInterface = () => {
  return (
    <div className="attendee-interface">
      <header>
        <h1>Event Attendee</h1>
        <nav>
          <a href="#travel">Travel Search</a>
          <a href="#lodging">Lodging Search</a>
          <a href="#sharing">Sharing</a>
        </nav>
      </header>
      <main>
        <section id="travel">
          <TravelSearch />
        </section>
        <section id="lodging">
          <LodgingSearch />
        </section>
        <section id="sharing">
          <Sharing />
        </section>
      </main>
      <footer>
        <p>© 2024 Event Attendee</p>
      </footer>
    </div>
  );
};

export default AttendeeInterface;
  