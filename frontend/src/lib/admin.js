import { api } from "./api";

export async function adminListUsers() {
  const r = await api.get("/admin/users");
  return r.data.users;
}

export async function adminUpdateUser(id, patch) {
  const r = await api.patch(`/admin/users/${id}`, patch);
  return r.data.user;
}

export async function adminActiveSessions() {
  const r = await api.get("/admin/sessions");
  return r.data.sessions;
}
