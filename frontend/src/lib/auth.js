import { api, setAccessToken } from "./api";

export async function login(email, password) {
  const r = await api.post("/auth/login", { email, password });
  setAccessToken(r.data.accessToken);
  return r.data.user;
}

export async function register(email, password) {
  const r = await api.post("/auth/register", { email, password });
  return r.data;
}

export async function me() {
  const r = await api.get("/user/me");
  return r.data.user;
}

export async function logout() {
  await api.post("/auth/logout");
  setAccessToken(null);
}
