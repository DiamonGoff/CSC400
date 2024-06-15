import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrganizerInterface from './components/Organizer/OrganizerInterface';
import AttendeeInterface from './components/Attendee/AttendeeInterface';
import Login from './components/Login';
import './App.css'; // Import the CSS file for styling

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>EventConnect</h1>
          <nav>
            <a href="/login" className="login-button">Login</a>
          </nav>
        </header>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/organizer" element={<OrganizerInterface />} />
          <Route path="/attendee" element={<AttendeeInterface />} />
          <Route path="/" element={
            <main>
              <h1>Welcome to the Event Management App</h1>
              <nav>
                <a href="/organizer">Organizer Interface</a>
                <br />
                <a href="/attendee">Attendee Interface</a>
              </nav>
            </main>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
