import React from 'react';
import HotelSuggestions from './HotelSuggestions';

const EventDetails = ({ event }) => {
    if (!event || !event.venue || !event.venue.location) {
        return <div>Invalid event data</div>;
    }

    const { name, venue } = event;
    const { lat, lng } = venue.location;

    if (typeof lat !== 'number' || typeof lng !== 'number') {
        return <div>Invalid location coordinates</div>;
    }

    return (
        <div>
            <h1>{name}</h1>
            <p>{venue.address}</p>
            <HotelSuggestions lat={lat} lng={lng} />
        </div>
    );
};

export default EventDetails;
