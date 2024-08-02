import React, { useEffect, useRef } from 'react';

function Map({ center, zoom, onPlaceSelected }) {
  const mapRef = useRef();
  const searchBoxRef = useRef();
  const mapInstance = useRef();
  const markerInstance = useRef();
  const infoWindowInstance = useRef();

  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error('Google Maps JavaScript API library is not loaded.');
      return;
    }

    // Initialize the map
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
    });

    // Initialize the marker
    markerInstance.current = new window.google.maps.Marker({
      map: mapInstance.current,
    });

    // Initialize the info window
    infoWindowInstance.current = new window.google.maps.InfoWindow();

    // Initialize the search box and link it to the UI element
    const searchBox = new window.google.maps.places.SearchBox(searchBoxRef.current);
    mapInstance.current.controls[window.google.maps.ControlPosition.TOP_LEFT].push(searchBoxRef.current);

    // Bias the SearchBox results towards current map's viewport
    mapInstance.current.addListener('bounds_changed', () => {
      searchBox.setBounds(mapInstance.current.getBounds());
    });

    // Listen for places changed event
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      // Clear out the old markers
      markerInstance.current.setMap(null);

      // For each place, get the icon, name, and location
      const bounds = new window.google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log('Returned place contains no geometry');
          return;
        }

        // Create a marker for each place
        markerInstance.current.setPosition(place.geometry.location);
        markerInstance.current.setMap(mapInstance.current);

        // Set the info window content
        const contentString = `
          <div>
            <h3>${place.name}</h3>
            <p><strong>Address:</strong> ${place.formatted_address}</p>
            <p><strong>Phone:</strong> ${place.formatted_phone_number || 'N/A'}</p>
            <p><strong>Website:</strong> <a href="${place.website}" target="_blank" rel="noopener noreferrer">${place.website}</a></p>
          </div>
        `;
        infoWindowInstance.current.setContent(contentString);
        infoWindowInstance.current.open(mapInstance.current, markerInstance.current);

        if (place.geometry.viewport) {
          // Only geocodes have viewport
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

        // Notify the parent component about the selected place
        if (onPlaceSelected) {
          onPlaceSelected(place);
        }
      });
      mapInstance.current.fitBounds(bounds);
    });
  }, [onPlaceSelected]);

  // Update the map center and zoom when props change
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setCenter(center);
      mapInstance.current.setZoom(zoom);
    }
  }, [center, zoom]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <input
        ref={searchBoxRef}
        type="text"
        placeholder="Search for venues"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: '1000',
          width: '300px',
          padding: '10px',
        }}
      />
      <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
    </div>
  );
}

export default Map;
