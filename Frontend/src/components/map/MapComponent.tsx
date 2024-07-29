import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_API_MAXBOX_TOKEN; // Make sure this is set in your environment variables

interface MapComponentProps {
  from: [number, number]; // [longitude, latitude]
  to: [number, number]; // [longitude, latitude]
  onRouteFetched: (route: any) => void; // Callback to handle the route data
}

const MapComponent: React.FC<MapComponentProps> = ({ from, to, onRouteFetched }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2], // Center the map between the two points
      zoom: 9,
    });

    // Fetch the route from the Mapbox Directions API
    const fetchRoute = async () => {
      try {
        const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`);
        const route = response.data.routes[0];
        if (route) {
          const geojson:any = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.geometry.coordinates
            }
          };

          // Add the route to the map
          map.current?.on('load', () => {
            if (!map.current) return;

            map.current.addSource('route', {
              type: 'geojson',
              data: geojson
            });

            map.current.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3ebaff',
                'line-width': 8
              }
            });

            // Add markers for 'from' and 'to' points
            new mapboxgl.Marker().setLngLat(from).addTo(map.current);
            new mapboxgl.Marker().setLngLat(to).addTo(map.current);

            // Fit the map to the route
            const bounds = new mapboxgl.LngLatBounds();
            geojson.geometry.coordinates.forEach((coord:any) => bounds.extend(coord));
            map.current.fitBounds(bounds, { padding: { top: 20, bottom: 20, left: 20, right: 20 } });

            // Call the callback with the route data
            onRouteFetched(route);
          });
        }
      } catch (error) {
        console.error('Error fetching directions:', error);
      }
    };

    fetchRoute();

    return () => map.current?.remove();
  }, []);

  return <div ref={mapContainer} className='h-[500px] w-[700px] rounded-lg' />;
};

export default MapComponent;
