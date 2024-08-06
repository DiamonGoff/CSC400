import React, { useEffect, useRef } from 'react';

function MapComponent({ center, zoom, markers = [] }) {
  const mapRef = useRef();
  const mapInstance = useRef();

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps JavaScript API library is not loaded.');
      return;
    }

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
    });

    markers.forEach(({ position, title }) => {
      const marker = new window.google.maps.Marker({
        position,
        map: mapInstance.current,
        title,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: title,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance.current, marker);
      });
    });
  }, [center, zoom, markers]);

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setCenter(center);
      mapInstance.current.setZoom(zoom);
    }
  }, [center, zoom]);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}

export default MapComponent;
