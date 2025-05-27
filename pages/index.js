import { useState, useEffect } from 'react';
import Head from 'next/head';
import jadwalKA from '../data/jadwal';
import { timeStringToMinutes, interpolatePosition } from '../utils/interpolateTrainPosition';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('../components/Map'), {
  ssr: false
});

export default function Home() {
  const [trainData, setTrainData] = useState(null);
  const [trainPosition, setTrainPosition] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const jakartaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
      const nowMinutes = jakartaTime.getHours() * 60 + jakartaTime.getMinutes() + jakartaTime.getSeconds() / 60;

      const result = interpolatePosition(nowMinutes, jadwalKA);
      setTrainPosition(result.koordinat);
      setTrainData({
        currentStop: result.currentStop,
        nextStop: result.nextStop
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Tracker KA Rangkasbitung - Tanah Abang</title>
        <meta name="description" content="Real-time tracking KA Commuter Line Rangkasbitung - Tanah Abang" />
      </Head>

      <main>
        <h1>Tracker KA Rangkasbitung - Tanah Abang</h1>

        <div className="content">
          <div className="map-container">
            {trainPosition ? (
              <Map 
                trainPosition={trainPosition}
                currentStop={trainData?.currentStop}
                nextStop={trainData?.nextStop}
              />
            ) : (
              <p>Memuat posisi kereta...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
