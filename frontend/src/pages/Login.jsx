import { useState } from "react";
import { login } from "../lib/auth.js";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ onAuthed }) {
  const [email, setEmail] = useState("lan@test.com");
  const [password, setPassword] = useState("Password123");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h1 className="h3 mb-3">Login</h1>

      {err && <div className="alert alert-danger">{err}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn btn-dark w-100"
            disabled={loading}
            onClick={async () => {
              setErr("");
              setLoading(true);
              try {
                const u = await login(email, password);
                onAuthed?.(u);
                nav("/dashboard");
              } catch (e) {
                setErr(e?.response?.data?.error || "Login failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="mt-3 text-muted small">
            No account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
