import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import OrganizerInterface from './components/Organizer/OrganizerInterface';
import AttendeeInterface from './components/Attendee/AttendeeInterface';
import Login from './components/Login';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import Register from './components/Register';
import Profile from './components/Profile'; // Import Profile component
import axiosInstance from './axiosInstance'; // Import the configured Axios instance
import './App.css'; // Import the CSS file for styling

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.get('/auth/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(error => {
        console.error('Token verification failed', error);
        localStorage.removeItem('token');
      });
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header user={user} setUser={setUser} /> {/* Pass setUser to Header */}
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/organizer" element={<OrganizerInterface user={user} setUser={setUser} />} />
          <Route path="/organizer/profile" element={<Profile user={user} />} />
          <Route path="/attendee" element={<AttendeeInterface eventLocation="37.7749,-122.4194" />} /> {/* Pass eventLocation prop */}
          <Route path="/register" element={<Register />} />
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
                  <img src="Mabook2.png" alt="Event" className="event-image" />
                </section>
                <FeaturesSection />
                <section id="about" className="about-section">
                  <h2>About EventConnect</h2>
                  <p>EventConnect is your ultimate solution for seamless birthday planning and management. Our platform is designed to make organizing and attending birthday parties effortless and enjoyable. Whether you're an event organizer or an attendee, EventConnect offers a comprehensive set of features to cater to all your needs.</p>
                  <h3>For Organizers</h3>
                  <ul>
                    <li><strong>Create and Manage Events</strong>: Easily create new events with detailed information such as date, time, location, and description. Manage your events efficiently with our user-friendly interface.</li>
                    <li><strong>Venue Search and Management</strong>: Find the perfect venue for your event using our integrated Google Maps API. Search for venues based on location, capacity, amenities, and budget.</li>
                    <li><strong>Task Management</strong>: Keep track of all your tasks and ensure everything is on schedule. Our task management feature helps you stay organized and on top of your event planning.</li>
                  </ul>
                  <h3>For Attendees</h3>
                  <ul>
                    <li><strong>RSVP</strong>: Quickly RSVP to events you're invited to and let the organizer know if you'll be attending.</li>
                    <li><strong>Gift Ideas</strong>: Browse through a curated list of gift ideas to make choosing the perfect gift a breeze.</li>
                    <li><strong>Social Interaction</strong>: Interact with other attendees, share your excitement, and coordinate plans through our social features.</li>
                  </ul>
                  <h3>Why Choose EventConnect?</h3>
                  <p>EventConnect is built with the goal of simplifying event planning and enhancing the overall experience for both organizers and attendees. Our platform provides:</p>
                  <ul>
                    <li><strong>User-Friendly Interface</strong>: An intuitive and easy-to-navigate interface for a seamless user experience.</li>
                    <li><strong>Comprehensive Features</strong>: A wide range of features to cover all aspects of event planning and management.</li>
                    <li><strong>Integrated Solutions</strong>: Leverage the power of integrated solutions like Google Maps for venue search and more.</li>
                  </ul>
                  <p>Join EventConnect today and make your next birthday celebration an unforgettable experience.</p>
                </section>
                <section className="testimonials-section">
                  <h2>What Our Users Say</h2>
                  <div className="testimonial">
                    <p>"EventConnect made planning my birthday party a breeze. Highly recommended!"</p>
                    <span>- NotDiamon</span>
                  </div>
                  <div className="testimonial">
                    <p>"The best app for event management. Easy to use and very efficient."</p>
                    <span>- AlsoNotDiamon</span>
                  </div>
                </section>
                {!user && (
                  <section className="cta-section">
                    <h2>Get Started with EventConnect</h2>
                    <p>Sign up today and start planning your perfect event!</p>
                    <Link to="/register" className="btn btn-primary">Sign Up</Link>
                    <Link to="/login" className="btn btn-secondary">Log In</Link>
                  </section>
                )}
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
