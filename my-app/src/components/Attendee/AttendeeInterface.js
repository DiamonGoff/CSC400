import React from 'react';
import './AttendeeInterface.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faShareAlt, faCommentDots, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import TravelSearch from './TravelSearch';

function AttendeeInterface({ eventLocation }) {
  const handleSocialShare = (platform) => {
    const url = window.location.href;
    const text = 'Check out this birthday event!';
    let shareUrl = '';

    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <div className="attendee-background">
      <div className="container">
        <header className="header">
          <h1>Birthday Party Planner - Attendee Interface</h1>
        </header>
        <section>
          <br />
          <h2><FontAwesomeIcon icon={faEnvelope} /> RSVP</h2>
          <form>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <button type="submit">RSVP</button>
          </form>
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faGift} /> Gift Ideas</h2>
          <p>Explore the best gift ideas for the birthday event.</p>
          <button className="btn">View Gift Ideas</button>
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faShareAlt} /> Social Interaction</h2>
          <p>Share the event details on social media and interact with other attendees.</p>
          <button className="btn social-btn facebook" onClick={() => handleSocialShare('facebook')}>Share on Facebook</button>
          <button className="btn social-btn twitter" onClick={() => handleSocialShare('twitter')}>Share on X</button>
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faCommentDots} /> Comments</h2>
          <p>Leave your comments and wishes for the birthday person.</p>
          <form>
            <input type="text" placeholder="Your Comment" />
            <button type="submit">Submit Comment</button>
          </form>
        </section>
        <section>
          <TravelSearch eventLocation={eventLocation} />
        </section>
        <footer>
          &copy; 2024 EventConnect. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default AttendeeInterface;
