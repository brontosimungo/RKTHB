export function timeStringToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function interpolatePosition(nowMinutes, schedule) {
  if (schedule.length === 0) return null;

  const first = schedule[0];
  const last = schedule[schedule.length - 1];

  const startMinutes = timeStringToMinutes(first.waktuBerangkat);
  const endMinutes = timeStringToMinutes(last.waktuTiba);

  // Sebelum perjalanan dimulai
  if (nowMinutes < startMinutes) {
    return {
      koordinat: first.koordinat,
      currentStop: null,
      nextStop: first
    };
  }

  // Setelah perjalanan selesai
  if (nowMinutes > endMinutes) {
    return {
      koordinat: last.koordinat,
      currentStop: last,
      nextStop: null
    };
  }

  // Cari segmen waktu aktif
  for (let i = 0; i < schedule.length - 1; i++) {
    const current = schedule[i];
    const next = schedule[i + 1];

    const depart = timeStringToMinutes(current.waktuBerangkat);
    const arrive = timeStringToMinutes(next.waktuTiba);

    if (nowMinutes >= depart && nowMinutes <= arrive) {
      const fraction = (nowMinutes - depart) / (arrive - depart);
      const [lat1, lng1] = current.koordinat;
      const [lat2, lng2] = next.koordinat;

      const lat = lat1 + fraction * (lat2 - lat1);
      const lng = lng1 + fraction * (lng2 - lng1);

      return {
        koordinat: [lat, lng],
        currentStop: current,
        nextStop: next
      };
    }
  }

  // Jika tidak ditemukan (harusnya tidak terjadi)
  return {
    koordinat: last.koordinat,
    currentStop: last,
    nextStop: null
  };
}
