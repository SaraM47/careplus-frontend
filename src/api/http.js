import axios from "axios";

// Shared axios instance with base config for API calls
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
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

// Handle 401 unauthorized responses globally
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      sessionStorage.removeItem("inv_token");
      sessionStorage.removeItem("inv_user");
    }
    return Promise.reject(err);
  }
);
