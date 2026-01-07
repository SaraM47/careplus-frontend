import axios from "axios";

// Shared axios instance with base config for API calls
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // Increased timeout for Render cold start
  timeout: 120000, // 120 seconds
});

// Add auth token to headers if available
http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("inv_token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle responses and errors globally
http.interceptors.response.use(
  (res) => res,
  (err) => {
    // If backend is cold starting or sleeping
    if (err.code === "ECONNABORTED") {
      console.warn("Backend svarade inte i tid. Möjligen cold start på Render.");
    }

    // If not authenticated anymore, clear session
    if (err?.response?.status === 401) {
      sessionStorage.removeItem("inv_token");
      sessionStorage.removeItem("inv_user");
    }

    return Promise.reject(err);
  }
);
