const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3001/oauth2callback'
);

const getAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  return url;
};

const setAuthToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

const createEvent = async (event) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  });
  return response;
};

module.exports = {
  getAuthUrl,
  setAuthToken,
  createEvent,
};
