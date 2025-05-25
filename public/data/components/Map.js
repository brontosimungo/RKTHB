import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ trainPosition }) => {
  const mapRef = useRef(null);
  const trainMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Inisialisasi peta
      mapRef.current = L.map('map').setView([-6.25, 106.6], 11);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Load jalur rel
      fetch('/data/route-line.geojson')
        .then(response => response.json())
        .then(data => {
          routeLayerRef.current = L.geoJSON(data, {
            style: { color: 'blue', weight: 3 }
          }).addTo(mapRef.current);
        });

      // Load stasiun
      fetch('/data/stations.geojson')
        .then(response => response.json())
        .then(data => {
          L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              return L.marker(latlng, {
                icon: L.divIcon({
                  html: `<div class="station-marker">${feature.properties.name}</div>`,
                  className: 'station-icon'
                })
              }).bindPopup(feature.properties.name);
            }
          }).addTo(mapRef.current);
        });

      // Inisialisasi marker kereta
      const trainIcon = L.icon({
        iconUrl: '/images/train-icon.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      trainMarkerRef.current = L.marker([-6.3598, 106.2494], { icon: trainIcon })
        .addTo(mapRef.current)
        .bindPopup('Kereta 1');
    }

    // Update posisi kereta
    if (trainPosition && trainMarkerRef.current) {
      trainMarkerRef.current.setLatLng([trainPosition.lat, trainPosition.lng]);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [trainPosition]);

  return <div id="map" style={{ height: '600px', width: '100%' }} />;
};

export default Map;
