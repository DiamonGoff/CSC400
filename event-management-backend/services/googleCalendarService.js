const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// Create an OAuth2 client with the Google API credentials
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID, // Google client ID from environment variables
  process.env.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables
  'http://localhost:3001/oauth2callback' // Redirect URI after OAuth2 authentication
);

// Function to generate an authentication URL for the user to authorize access
const getAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events', // Scope for accessing calendar events
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Request offline access to get a refresh token
    scope: scopes, // Set the required scopes
  });

  return url; // Return the generated authentication URL
};

// Function to exchange the authorization code for access and refresh tokens
const setAuthToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code); // Exchange the code for tokens
  oauth2Client.setCredentials(tokens); // Set the OAuth2 client credentials
  return tokens; // Return the tokens
};

// Function to create a new calendar event
const createEvent = async (event) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client }); // Initialize the Google Calendar API
  const response = await calendar.events.insert({
    calendarId: 'primary', // Use the primary calendar
    resource: event, // Event details to be inserted
  });
  return response; // Return the API response
};

// Export the functions for use in other parts of the application
module.exports = {
  getAuthUrl,
  setAuthToken,
  createEvent,
};
