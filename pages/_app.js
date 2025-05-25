// pages/_app.js
import '@/styles/globals.css'; // ✅ Impor global CSS di sini

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
