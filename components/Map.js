import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StationMarker from './StationMarker';
import jalurRel from '../data/jalurRel.json';
<L.GeoJSON
  data={jalurRel}
  style={() => ({
    color: jalurRel.features[0].properties.color,
    weight: 4
  })}
/>

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
      fetch('/data/jalurRel.json')
        .then(response => response.json())
        .then(data => {
          routeLayerRef.current = L.geoJSON(data, {
            style: { color: '#0056b3', weight: 4 }
          }).addTo(mapRef.current);
        });

      // Load data stasiun
      ffetch('/data/jalurRel.json')
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

  // Update / render marker kereta saat posisi trainPosition berubah
  useEffect(() => {
    if (!mapRef.current || !trainPosition) return;

    if (trainMarkerRef.current) {
      trainMarkerRef.current.setLatLng(trainPosition);
    } else {
      // Icon kereta custom (bisa pakai icon image atau divIcon)
      const trainIcon = L.divIcon({
        html: `<div style="color:red; font-weight:bold;">🚆</div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      trainMarkerRef.current = L.marker(trainPosition, { icon: trainIcon, zIndexOffset: 1100 })
        .addTo(mapRef.current)
        .bindPopup('Kereta KA 1672');
    }
  }, [trainPosition]);

  return (
    <div id="map" style={{ height: '600px', width: '100%' }}>
      {mapRef.current && renderStationMarkers()}
    </div>
  );
};

export default Map;
