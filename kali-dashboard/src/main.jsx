import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Cosine Autonomous Monitoring
const cosineMonitor = {
  start: () => {
    setInterval(async () => {
      const res = await fetch('https://www.cosineautonomous.com');
      document.getElementById('cosine-status').innerText = 
        `Status: ${res.ok ? '🟢 LIVE' : '🔴 DOWN'}`;
    }, 60000);
  }
};
cosineMonitor.start();
