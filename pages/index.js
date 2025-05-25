import { useState, useEffect } from 'react';
import Head from 'next/head';
import Map from '../components/Map';
import Ka1672Schedule from '../components/Ka1672Schedule';
import jadwalKA from '../public/data/jadwal.json';
import { timeStringToMinutes, interpolatePosition } from '../utils/interpolateTrainPosition';

export default function Home() {
  const [trainData, setTrainData] = useState(null);
  const [trainPosition, setTrainPosition] = useState(null);

  useEffect(() => {
    // Update posisi kereta tiap detik
    const interval = setInterval(() => {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
      const pos = interpolatePosition(nowMinutes, jadwalKA);
      setTrainPosition(pos);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Tracker KA 1672 Rangkasbitung - Tanah Abang</title>
        <meta name="description" content="Real-time tracking KA 1672 Commuter Line Rangkasbitung - Tanah Abang" />
      </Head>

      <main>
        <h1>Tracker KA 1672 Rangkasbitung - Tanah Abang</h1>
        
        <div className="content">
          <div className="map-container">
            <Map 
              trainPosition={trainPosition}
              currentStop={trainData?.currentStop}
              nextStop={trainData?.nextStop}
            />
          </div>
          
          <div className="schedule-container">
            <Ka1672Schedule onTrainSelect={setTrainData} />
          </div>
        </div>
      </main>
    </div>
  );
}
