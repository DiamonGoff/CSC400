import React from 'react';
import './OrganizerInterface.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faCalendarAlt, faSearch, faTasks } from '@fortawesome/free-solid-svg-icons';

function OrganizerInterface() {
  return (
    <div className="organizer-background">
      <div className="container">
        <header className="header">
          <h1>Event Organizer Interface</h1>
        </header>
        <section>
        <br />
          <h2><FontAwesomeIcon icon={faCalendarPlus} /> Create New Event</h2>
          <form>
            <input type="text" placeholder="Event Name" />
            <input type="date" placeholder="Date" />
            <input type="time" placeholder="Time" />
            <input type="text" placeholder="Location" />
            <textarea placeholder="Description"></textarea>
            <button type="submit">Create Event</button>
          </form>
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faCalendarAlt} /> Manage Events</h2>
          <div className="event-list">
            <div className="event">
              <p>Event 1</p>
              <button className="btn-edit">Edit</button>
              <br /><br />
              <button className="btn-delete">Delete</button>
            </div>
            <div className="event">
              <p>Event 2</p>
              <button className="btn-edit">Edit</button>
              <br />
              <br />
              <button className="btn-delete">Delete</button>
            </div>
          </div>
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faSearch} /> Venue Search</h2>
          <form>
            <input type="text" placeholder="Location" />
            <input type="text" placeholder="Capacity" />
            <input type="text" placeholder="Amenities" />
            <input type="text" placeholder="Budget" />
            <button type="submit">Search</button>
          </form>
        </section>
        <section>
          <h2><FontAwesomeIcon icon={faTasks} /> Task Management</h2>
          <div className="task-list">
            <div className="task">
              <p>Task 1</p>
              <button className="btn-edit">Edit</button>
              <br />
              <br />
              <button className="btn-complete">Complete</button>
            </div>
            <div className="task">
              <p>Task 2</p>
              <button className="btn-edit">Edit</button>
              <br />
              <br />
              <button className="btn-complete">Complete</button>
            </div>
          </div>
        </section>
        <footer>
          &copy; 2024 EventConnect. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default OrganizerInterface;
