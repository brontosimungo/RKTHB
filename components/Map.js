import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ trainPosition, currentStop, nextStop }) => {
  const mapRef = useRef(null);
  const trainMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const stopsLayerRef = useRef(null);

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
            style: { color: '#0056b3', weight: 4 }
          }).addTo(mapRef.current);
        });

      // Load stasiun
      fetch('/data/stations.geojson')
        .then(response => response.json())
        .then(data => {
          stopsLayerRef.current = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              return L.marker(latlng, {
                icon: L.divIcon({
                  html: `<div class="station-marker">
                          <span class="station-code">${feature.properties.code}</span>
                          <span class="station-name">${feature.properties.name}</span>
                        </div>`,
                  className: 'station-icon'
                })
              }).bindPopup(`${feature.properties.name} (${feature.properties.code})`);
            }
          }).addTo(mapRef.current);
        });

      // Inisialisasi marker kereta
      const trainIcon = L.icon({
        iconUrl: '/images/train-icon.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      trainMarkerRef.current = L.marker([-6.3598, 106.2494], { 
        icon: trainIcon,
        zIndexOffset: 1000
      }).addTo(mapRef.current);
    }

    // Update posisi kereta
    if (trainPosition && trainMarkerRef.current) {
      trainMarkerRef.current.setLatLng([trainPosition.lat, trainPosition.lng]);
      
      // Update popup dengan info stasiun
      let popupContent = 'KA 1672 Commuter Line Rangkasbitung';
      if (currentStop) {
        popupContent += `<br/>Stasiun Terakhir: ${currentStop.stasiun} (${currentStop.kode})`;
      }
      if (nextStop) {
        popupContent += `<br/>Menuju: ${nextStop.stasiun} (${nextStop.kode})`;
      }
      
      trainMarkerRef.current.bindPopup(popupContent).openPopup();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [trainPosition, currentStop, nextStop]);

  return <div id="map" style={{ height: '600px', width: '100%' }} />;
};

export default Map;
