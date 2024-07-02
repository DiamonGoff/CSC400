import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import OrganizerInterface from './components/Organizer/OrganizerInterface';
import AttendeeInterface from './components/Attendee/AttendeeInterface';
import Login from './components/Login';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import Register from './components/Register';
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
          <Route path="/register" element={<Register />} /> {/* Route for Register component */}
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
                    
                      <Link to="/register" className="btn">Sign Up</Link> {/* Add Register link */}
                    </nav>
                  </div>
                </section>
                <section className="image-section">
                  <img src="Mabook2.png" alt="Event" className="event-image" />
                </section>
                <FeaturesSection />
                <section id="about" className="about-section">
                  <h2>About EventConnect</h2>
                  <p>EventConnect is designed to streamline planning and attending birthday parties. Organizers can search and book venues, manage guest lists, and send invitations. Attendees can find travel options and interact via social media.</p>
                </section>
                <section className="testimonials-section">
                  <h2>What Our Users Say</h2>
                  <div className="testimonial">
                    <p>"EventConnect made planning my birthday party a breeze. Highly recommended!"</p>
                    <span>- User A</span>
                  </div>
                  <div className="testimonial">
                    <p>"The best app for event management. Easy to use and very efficient."</p>
                    <span>- User B</span>
                  </div>
                </section>
                <section className="cta-section">
                  <h2>Get Started with EventConnect</h2>
                  <p>Sign up today and start planning your perfect event!</p>
                  <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                  <Link to="/login" className="btn btn-secondary">Log In</Link>
                </section>
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
