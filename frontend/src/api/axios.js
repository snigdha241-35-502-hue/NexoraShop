import axios from "axios";

// All requests go to /api/* which Vite proxies to the Express server
// (see vite.config.js) - in production, point this at your deployed API.
const api = axios.create({
  baseURL: "/api",
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nexora_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
