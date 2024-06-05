import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import OrganizerInterface from './components/Organizer/OrganizerInterface';
import AttendeeInterface from './components/Attendee/AttendeeInterface';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/organizer" component={OrganizerInterface} />
          <Route path="/attendee" component={AttendeeInterface} />
          <Route path="/" exact>
            <h1>Welcome to the Event Management App</h1>
            <nav>
              <a href="/organizer">Organizer Interface</a>
              <a href="/attendee">Attendee Interface</a>
            </nav>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
