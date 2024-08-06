import React from 'react';
import RsvpForm from './RsvpForm';
import RsvpList from './RsvpList';

const EventDetail = ({ eventId }) => {
  return (
    <div>
      <h2>Event Details</h2>
      {/* Other event details here */}
      <RsvpForm eventId={eventId} />
      <RsvpList eventId={eventId} />
    </div>
  );
};

export default EventDetail;
