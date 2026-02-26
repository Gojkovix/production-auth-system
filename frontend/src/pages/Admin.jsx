import { useEffect, useState } from "react";
import {
  adminActiveSessions,
  adminListUsers,
  adminUpdateUser,
} from "../lib/admin";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const [u, s] = await Promise.all([
        adminListUsers(),
        adminActiveSessions(),
      ]);
      setUsers(u);
      setSessions(s);
    } catch (e) {
      setErr(e?.response?.data?.error || "Admin load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 m-0">Admin panel</h1>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={load}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}
      {loading && <div className="text-muted">Loading...</div>}

      {!loading && (
        <div className="row g-3">
          <div className="col-lg-7">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="fw-semibold">Users</div>
                  <div className="text-muted small">{users.length}</div>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Verified</th>
                        <th>Disabled</th>
                        <th style={{ width: 140 }} />
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td className="text-break">{u.email}</td>
                          <td>
                            <span
                              className={
                                "badge " +
                                (u.role === "admin"
                                  ? "text-bg-primary"
                                  : "text-bg-secondary")
                              }
                            >
                              {u.role}
                            </span>
                          </td>
                          <td>{u.emailVerified ? "✅" : "—"}</td>
                          <td>{u.disabled ? "✅" : "—"}</td>
                          <td className="text-end">
                            <button
                              className="btn btn-outline-primary btn-sm me-2"
                              onClick={async () => {
                                const next =
                                  u.role === "admin" ? "user" : "admin";
                                const updated = await adminUpdateUser(u._id, {
                                  role: next,
                                });
                                setUsers((prev) =>
                                  prev.map((x) =>
                                    x._id === u._id ? updated : x,
                                  ),
                                );
                              }}
                            >
                              Toggle role
                            </button>

                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={async () => {
                                const updated = await adminUpdateUser(u._id, {
                                  disabled: !u.disabled,
                                });
                                setUsers((prev) =>
                                  prev.map((x) =>
                                    x._id === u._id ? updated : x,
                                  ),
                                );
                              }}
                            >
                              {u.disabled ? "Enable" : "Disable"}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-muted py-3">
                            No users
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="fw-semibold">Active sessions</div>
                  <div className="text-muted small">{sessions.length}</div>
                </div>

                <div className="list-group">
                  {sessions.map((s) => (
                    <div key={s._id} className="list-group-item">
                      <div className="fw-semibold text-break">
                        {s.user?.email || "Unknown user"}
                      </div>
                      <div className="text-muted small text-break">
                        {s.ip || "—"}
                      </div>
                      <div className="text-muted small text-break">
                        {s.userAgent || "—"}
                      </div>
                      <div className="text-muted small">
                        Expires:{" "}
                        {s.expiresAt
                          ? new Date(s.expiresAt).toLocaleString()
                          : "—"}
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="list-group-item text-muted">
                      No active sessions
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
