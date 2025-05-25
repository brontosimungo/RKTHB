// konversi 'HH:MM' jadi menit dari tengah malam
export function timeStringToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// interpolasi posisi berdasarkan jadwal dan waktu saat ini (dalam menit)
export function interpolatePosition(nowMinutes, schedule) {
  if (nowMinutes < timeStringToMinutes(schedule[0].waktuBerangkat)) {
    return schedule[0].koordinat;
  }
  if (nowMinutes > timeStringToMinutes(schedule[schedule.length - 1].waktuTiba)) {
    return schedule[schedule.length - 1].koordinat;
  }

  for (let i = 0; i < schedule.length - 1; i++) {
    const current = schedule[i];
    const next = schedule[i + 1];

    const currentTime = timeStringToMinutes(current.waktuBerangkat);
    const nextTime = timeStringToMinutes(next.waktuTiba);

    if (nowMinutes >= currentTime && nowMinutes <= nextTime) {
      const fraction = (nowMinutes - currentTime) / (nextTime - currentTime);
      const lat = current.koordinat[0] + fraction * (next.koordinat[0] - current.koordinat[0]);
      const lng = current.koordinat[1] + fraction * (next.koordinat[1] - current.koordinat[1]);
      return [lat, lng];
    }
  }
  // fallback posisi terakhir
  return schedule[schedule.length - 1].koordinat;
}
