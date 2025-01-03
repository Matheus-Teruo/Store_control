import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.BACKEND_BASE_URL || "http://localhost:8080/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    // 'Authorization': `Bearer ${import.meta.env.API_TOKEN}`
  },
});

export default api;
