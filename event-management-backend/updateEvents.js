const mongoose = require('mongoose');
const Event = require('./models/Event'); // Adjust the path to your Event model as needed
require('dotenv').config(); // Load environment variables from .env file

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to MongoDB');

    // Find all events in the database
    const events = await Event.find();
    console.log(`Found ${events.length} events`);

    // Iterate through each event to update the location structure
    for (const event of events) {
      console.log(`Processing event: ${event.name}`);
      console.log(`Current event location structure: ${event.location}`);

      // Check if the event has latitude and longitude fields
      if (event.latitude && event.longitude) {
        // Update the location field with the new structure
        event.location = { lat: event.latitude, lng: event.longitude };
        delete event.latitude; // Remove the old latitude field
        delete event.longitude; // Remove the old longitude field
        await event.save(); // Save the updated event back to the database
        console.log(`Updated event: ${event.name}`);
      } else {
        console.log(`No latitude/longitude found for event: ${event.name}`);
      }
    }

    mongoose.disconnect(); // Disconnect from MongoDB when done
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err); // Handle connection errors
  });
