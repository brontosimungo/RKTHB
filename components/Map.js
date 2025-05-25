import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StationMarker from './StationMarker';

const Map = ({ trainPosition, currentStop, nextStop }) => {
  const mapRef = useRef(null);
  const trainMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const [stationsData, setStationsData] = useState([]);

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

      // Load data stasiun
      fetch('/data/stations.geojson')
        .then(response => response.json())
        .then(data => {
          setStationsData(data.features);
        });
    }
  }, []);

  // Render StationMarkers
  const renderStationMarkers = () => {
    return stationsData.map(station => {
      const isActive = currentStop && station.properties.code === currentStop.kode;
      const isNext = nextStop && station.properties.code === nextStop.kode;
      
      return (
        <StationMarker
          key={station.properties.code}
          map={mapRef.current}
          station={station}
          isActive={isActive}
          isNext={isNext}
        />
      );
    });
  };

  return (
    <div id="map" style={{ height: '600px', width: '100%' }}>
      {mapRef.current && renderStationMarkers()}
    </div>
  );
};

export default Map;
