import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

let accessToken = null;

export function setAccessToken(t) {
  accessToken = t;
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    const original = err.config;

    // Don't try refresh if:
    // - already retrying
    // - the request is itself refresh/login/register (avoid loops)
    const url = original?.url || "";
    const isAuthRoute =
      url.includes("/auth/refresh") ||
      url.includes("/auth/login") ||
      url.includes("/auth/register");

    if (status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true;

      // Try refresh ONCE
      try {
        const r = await api.post("/auth/refresh");
        setAccessToken(r.data.accessToken);
        return api(original);
      } catch {
        // refresh failed -> user is logged out
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  },
);
