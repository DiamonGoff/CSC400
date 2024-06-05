import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'; // Global CSS styles
import App from './App'; // Main App component

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
