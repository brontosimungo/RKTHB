import { useState } from 'react';
import Head from 'next/head';
import Map from '../components/Map';
import Ka1672Schedule from '../components/Ka1672Schedule';
import styles from '../styles/globals.css';

export default function Home() {
  const [trainData, setTrainData] = useState(null);

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
              trainPosition={trainData?.position}
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
