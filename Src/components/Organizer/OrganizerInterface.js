import React from 'react';
import VenueSearch from './VenueSearch';
import VenueManagement from './VenueManagement';

const OrganizerInterface = () => {
  return (
    <div className="organizer-interface">
      <header>
        <h1>Event Organizer</h1>
        <nav>
          <a href="#search">Search Venues</a>
          <a href="#manage">Manage Venues</a>
        </nav>
      </header>
      <main>
        <section id="search">
          <VenueSearch />
        </section>
        <section id="manage">
          <VenueManagement />
        </section>
      </main>
      <footer>
        <p>© 2024 Event Organizer</p>
      </footer>
    </div>
  );
};

export default OrganizerInterface;
