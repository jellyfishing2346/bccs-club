// pages/_app.js
import '../frontend/styles/globals.css'; // Make sure this points to your global styles if you have them

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp;
