const mongoose = require('mongoose');
const Event = require('./models/Event'); // Adjust the path as needed
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to MongoDB');

    // Find all events and update the location structure
    const events = await Event.find();
    console.log(`Found ${events.length} events`);

    for (const event of events) {
      console.log(`Processing event: ${event.name}`);
      console.log(`Current event location structure: ${event.location}`);

      if (event.latitude && event.longitude) {
        event.location = { lat: event.latitude, lng: event.longitude };
        delete event.latitude;
        delete event.longitude;
        await event.save();
        console.log(`Updated event: ${event.name}`);
      } else {
        console.log(`No latitude/longitude found for event: ${event.name}`);
      }
    }

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
