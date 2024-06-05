import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrganizerInterface from './components/Organizer/OrganizerInterface';
import AttendeeInterface from './components/Attendee/AttendeeInterface';
import VenueSearch from './components/Organizer/VenueSearch';
import VenueManagement from './components/Organizer/VenueManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/organizer" element={<OrganizerInterface />} />
          <Route path="/attendee" element={<AttendeeInterface />} />
          <Route path="/organizer/search-venues" element={<VenueSearch />} />
          <Route path="/organizer/manage-venues" element={<VenueManagement />} />
          <Route path="/" element={
            <>
              <h1>Welcome to EventConnect</h1>
              
              <nav>
                <a href="/organizer">Organizer Interface</a>



                <a href="/attendee"> Attendee Interface</a>
              </nav>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
