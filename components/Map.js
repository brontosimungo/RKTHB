import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function Map({ positions }) {
  const [jalur, setJalur] = useState(null);

  useEffect(() => {
    fetch('/data/jalurRel.json')
      .then(res => res.json())
      .then(data => setJalur(data));
  }, []);

  return (
    <MapContainer center={[-6.34, 106.5]} zoom={11} style={{ height: '90vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Garis rel */}
      {jalur && jalur.features.map((feature, i) => (
        <Polyline
          key={i}
          positions={feature.geometry.coordinates.map(([lng, lat]) => [lat, lng])}
          color="green"
        />
      ))}

      {/* Marker kereta */}
      {positions && Object.entries(positions).map(([kaId, pos]) => (
        <Marker
          key={kaId}
          position={[pos.koordinat[1], pos.koordinat[0]]}
          icon={markerIcon}
        >
          <Popup>
            <b>{kaId}</b><br />
            {pos.currentStop?.stasiun || '-'} → {pos.nextStop?.stasiun || '-'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
