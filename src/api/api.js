import axios from "axios";

// Create a base Axios instance
const api = axios.create({
  baseURL: import.meta.env.DEV 
    ? "/api/n8n" // Use proxy in development
    : "https://ritviksharmaa.app.n8n.cloud/webhook", // Direct in production
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the latest JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Axios interceptor error:", error);
    return Promise.reject(error);
  }
);

export default api;