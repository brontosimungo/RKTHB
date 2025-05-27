import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import jadwalKA from '../data/jadwal'; // pastikan path-nya benar
import { interpolateAllPositions, timeStringToMinutes } from '../utils/interpolateTrainPosition';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [positions, setPositions] = useState(null);

  useEffect(() => {
    const updatePositions = () => {
      const now = new Date();
      const localMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
      const pos = interpolateAllPositions(localMinutes, jadwalKA);
      setPositions(pos);
    };

    updatePositions();
    const interval = setInterval(updatePositions, 10000); // update tiap 10 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Tracker KA Rangkasbitung - Tanah Abang</h1>
      {positions ? (
        <Map positions={positions} />
      ) : (
        <p>Memuat posisi kereta...</p>
      )}
    </div>
  );
}
