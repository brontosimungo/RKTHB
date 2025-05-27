import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ trainPosition, currentStop, nextStop }) {
  const [routeData, setRouteData] = useState(null);
  const [stationsData, setStationsData] = useState([]);

  const mapRef = useRef();

  useEffect(() => {
    fetch('/data/jalurRel.json')
      .then(response => response.json())
      .then(data => {
        setRouteData(data);
        setStationsData(data.features || []);
      })
      .catch(err => {
        console.error("Gagal memuat jalur rel:", err);
      });
  }, []);

  const trainIcon = L.divIcon({
    className: 'train-icon',
    html: `<div style="font-weight:bold; color:red; font-size:14px;">1672</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  return (
    <MapContainer
      center={[-6.2, 106.8]}
      zoom={11}
      style={{ height: "600px", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {routeData && (
        <Polyline
          positions={routeData.features.map(f => f.geometry.coordinates.map(([lng, lat]) => [lat, lng])).flat()}
          color="#0056b3"
          weight={4}
        />
      )}

      {stationsData.map((feature, idx) => {
        const [lng, lat] = feature.geometry.coordinates;
        const name = feature.properties?.nama || `Stasiun ${idx + 1}`;
        return (
          <Marker key={idx} position={[lat, lng]}>
            <Popup>{name}</Popup>
          </Marker>
        );
      })}

      {trainPosition && (
        <Marker position={trainPosition} icon={trainIcon}>
          <Popup>
            <strong>KA 1672</strong><br />
            {currentStop && `Stasiun terakhir: ${currentStop.stasiun}`}<br />
            {nextStop && `Berikutnya: ${nextStop.stasiun}`}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
