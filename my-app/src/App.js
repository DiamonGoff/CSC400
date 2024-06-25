import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import OrganizerInterface from './components/Organizer/OrganizerInterface';
import AttendeeInterface from './components/Attendee/AttendeeInterface';
import Login from './components/Login';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import './App.css'; // Import the CSS file for styling

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/organizer" element={<OrganizerInterface />} />
          <Route path="/attendee" element={<AttendeeInterface />} />
          <Route path="/" element={
            <>
              <HeroSection />
              <main>
                <section className="welcome-section">
                  <div className="welcome-content">
                    <h1>Welcome to EventConnect</h1>
                    <p>Your ultimate solution for seamless Birthday planning and management.</p>
                    <nav>
                      <Link to="/organizer" className="btn">Organizer Interface</Link>
                      <Link to="/attendee" className="btn">Attendee Interface</Link>
                    </nav>
                  </div>
                </section>
                <section className="image-section">
                  <img src="Mabook2.png" alt="Event Image" className="event-image" />
                </section>
                <FeaturesSection />
              </main>
            </>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
