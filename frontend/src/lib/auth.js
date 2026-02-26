import { api, setAccessToken } from "./api";

// Auth
export function register(email, password) {
  return api.post("/auth/register", { email, password });
}

export function login(email, password) {
  return api.post("/auth/login", { email, password });
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

export function forgotPassword(email) {
  return api.post("/auth/forgot-password", { email });
}

export async function resetPassword(token, newPassword) {
  return api.post("/auth/reset-password", { token, newPassword });
}
