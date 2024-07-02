import React, { useEffect, useRef } from 'react';

function Map({ center, zoom }) {
  const mapRef = useRef();

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
    });

    new window.google.maps.Marker({
      position: center,
      map,
    });
  }, [center, zoom]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
}

export default Map;
