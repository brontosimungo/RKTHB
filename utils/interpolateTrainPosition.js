export function interpolateAllPositions(jadwal, currentTimeMinutes) {
  const positions = {};
  for (const kaId in jadwal) {
    positions[kaId] = interpolateTrainPosition(jadwal[kaId], currentTimeMinutes);
  }
  return positions;
}

// Pastikan ini juga ada
export function interpolateTrainPosition(jadwalKA, currentTimeMinutes) {
  for (let i = 0; i < jadwalKA.length - 1; i++) {
    const stop = jadwalKA[i];
    const nextStop = jadwalKA[i + 1];

    const departureMinutes = timeStringToMinutes(stop.waktuBerangkat);
    const arrivalMinutes = timeStringToMinutes(nextStop.waktuTiba);

    if (departureMinutes !== null && arrivalMinutes !== null &&
        currentTimeMinutes >= departureMinutes && currentTimeMinutes <= arrivalMinutes) {

      const progress = (currentTimeMinutes - departureMinutes) / (arrivalMinutes - departureMinutes);

      const lon = stop.koordinat[0] + progress * (nextStop.koordinat[0] - stop.koordinat[0]);
      const lat = stop.koordinat[1] + progress * (nextStop.koordinat[1] - stop.koordinat[1]);

      return {
        koordinat: [lon, lat],
        currentStop: stop,
        nextStop: nextStop,
        progress,
      };
    }
  }

  // fallback: jika belum jalan atau sudah sampai tujuan
  const first = jadwalKA[0];
  const last = jadwalKA[jadwalKA.length - 1];
  const now = currentTimeMinutes;

  if (now < timeStringToMinutes(first.waktuBerangkat)) {
    return {
      koordinat: first.koordinat,
      currentStop: null,
      nextStop: first,
      progress: 0,
    };
  }

  return {
    koordinat: last.koordinat,
    currentStop: last,
    nextStop: null,
    progress: 1,
  };
}

function timeStringToMinutes(timeStr) {
  if (!timeStr) return null;
  const [h, m, s] = timeStr.split(':').map(Number);
  return h * 60 + m + (s ? s / 60 : 0);
}
