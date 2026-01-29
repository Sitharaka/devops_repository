import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Set the base URL for Axios to point to the backend server
axios.defaults.baseURL = 'http://localhost:5000';

// Prevent accidental localStorage persistence: override write/remove methods to no-op
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem = function() { console.warn('localStorage.setItem blocked by app policy'); };
    window.localStorage.removeItem = function() { console.warn('localStorage.removeItem blocked by app policy'); };
  }
} catch (e) {
  // ignore in non-browser environments
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

