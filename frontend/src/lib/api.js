import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true
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

    if (status === 401 && !original._retry) {
      original._retry = true;

      if (!refreshing) {
        refreshing = api
          .post("/auth/refresh")
          .then((r) => {
            setAccessToken(r.data.accessToken);
            return r.data.accessToken;
          })
          .finally(() => {
            refreshing = null;
          });
      }

      await refreshing;
      return api(original);
    }

    return Promise.reject(err);
  }
);