import axios from 'axios';

const api = axios.create({
  baseURL: process.env.BACKEND_BASE_URL || "http://localhost:8080/",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${process.env.API_TOKEN}`
  }
});

export default api;