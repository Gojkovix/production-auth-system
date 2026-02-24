import { api, setAccessToken } from "./api";

// Auth
export async function login(email, password) {
  const r = await api.post("/auth/login", { email, password });
  setAccessToken(r.data.accessToken);
  return r.data.user;
}

export async function register(email, password) {
  const r = await api.post("/auth/register", { email, password });
  return r.data;
}

export async function logout() {
  await api.post("/auth/logout");
  setAccessToken(null);
}

// Session
export async function me() {
  const r = await api.get("/user/me");
  return r.data.user;
}

// Bootstraps session using refresh cookie (silent login)
export async function bootstrapSession() {
  // If refresh cookie exists, this returns new accessToken
  const r = await api.post("/auth/refresh");
  setAccessToken(r.data.accessToken);

  // Now /user/me should work with Authorization header
  return await me();
}

// Email flows
export async function verifyEmail(token) {
  const r = await api.post("/auth/verify-email", { token });
  return r.data;
}

export async function forgotPassword(email) {
  const r = await api.post("/auth/forgot-password", { email });
  return r.data;
}

export async function resetPassword(token, password) {
  const r = await api.post("/auth/reset-password", { token, password });
  return r.data;
}
