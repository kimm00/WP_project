import axios from 'axios';

// Automatically determine baseURL depending on environment
const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://challedger-backend.onrender.com' // In production, requests are sent to the same origin → use relative paths
    : 'http://localhost:4000'; // In development, specify backend address explicitly

const api = axios.create({
  baseURL,
  withCredentials: true, // Set to true if you need to include cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;