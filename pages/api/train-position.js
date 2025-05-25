import schedule from '../../public/data/ka_1672_schedule.json';
import stations from '../../public/data/stations';

export default async function handler(req, res) {
  const stations = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/data/stations.geojson')
    .then(response => response.json());
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  // Buat mapping stasiun dari geojson
  const stationMap = {};
  stations.features.forEach(feature => {
    stationMap[feature.properties.code] = {
      coords: feature.geometry.coordinates.reverse(), // [lng, lat] -> [lat, lng]
      name: feature.properties.name
    };
  });

  // Cari segmen aktif
  let activeSegment = null;
  let currentPosition = null;
  let currentStop = null;
  let nextStop = null;

  for (let i = 0; i < schedule.rute.length - 1; i++) {
    const stop = schedule.rute[i];
    const next = schedule.rute[i + 1];
    
    const startTime = stop.berangkat ? convertToMinutes(stop.berangkat) : convertToMinutes(stop.datang);
    const endTime = next.datang ? convertToMinutes(next.datang) : convertToMinutes(next.berangkat);
    
    if (startTime && endTime && currentTime >= startTime && currentTime <= endTime) {
      activeSegment = { from: stop, to: next };
      const progress = (currentTime - startTime) / (endTime - startTime);
      
      const fromCoords = stationMap[stop.kode]?.coords;
      const toCoords = stationMap[next.kode]?.coords;
      
      if (fromCoords && toCoords) {
        currentPosition = {
          lat: fromCoords[0] + (toCoords[0] - fromCoords[0]) * progress,
          lng: fromCoords[1] + (toCoords[1] - fromCoords[1]) * progress
        };
      }
      
      currentStop = stop;
      nextStop = next;
      break;
    }
  }

  res.status(200).json({
    position: currentPosition,
    currentStop,
    nextStop,
    progress: activeSegment ? 
      (currentTime - (convertToMinutes(activeSegment.from.berangkat) || convertToMinutes(activeSegment.from.datang))) / 
      ((convertToMinutes(activeSegment.to.datang) || convertToMinutes(activeSegment.to.berangkat)) - 
       (convertToMinutes(activeSegment.from.berangkat) || convertToMinutes(activeSegment.from.datang))) : 0,
    updatedAt: now.toISOString(),
    schedule: schedule
  });
}

function convertToMinutes(timeStr) {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}
