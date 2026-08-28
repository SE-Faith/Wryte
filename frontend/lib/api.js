import axios from "axios";
import { useAuthStore } from "./store";

// Base URL from environment variables, defaulting to localhost:4000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial to pass signed cookies for CSRF double submit
  headers: {
    "Content-Type": "application/json",
  },
});

let csrfTokenPromise = null;

// Helper to fetch CSRF token once and keep it in cache
export const getCsrfToken = async () => {
  if (csrfTokenPromise) return csrfTokenPromise;
  
  csrfTokenPromise = api.get("/api/csrf-token")
    .then((res) => res.data.csrfToken)
    .catch((err) => {
      console.error("Failed to bootstrap CSRF token:", err);
      csrfTokenPromise = null;
      return null;
    });

  return csrfTokenPromise;
};

// Request Interceptor: Attach JWT token and CSRF token
api.interceptors.request.use(
  async (config) => {
    // 1. Inject JWT authorization header from Zustand store if token exists
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Inject CSRF Token for state-changing requests
    const stateChangingMethods = ["post", "put", "delete", "patch"];
    if (stateChangingMethods.includes(config.method?.toLowerCase() || "")) {
      // If we don't have authorization header, the backend strictly requires CSRF double submit
      if (!config.headers.Authorization) {
        const csrfToken = await getCsrfToken();
        if (csrfToken) {
          config.headers["x-csrf-token"] = csrfToken;
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error logging / handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error response:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
