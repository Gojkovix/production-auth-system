import { useState } from "react";
import { register } from "../lib/auth.js";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h1 className="h3 mb-3">Create account</h1>

      {err && <div className="alert alert-danger">{err}</div>}
      {ok && (
        <div className="alert alert-success">
          Account created. <Link to="/login">Go to login</Link>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password (min 8)</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn btn-warning w-100"
            disabled={loading}
            onClick={async () => {
              setErr("");
              setOk(false);
              setLoading(true);

              try {
                await register(email, password);
                setOk(true);
              } catch (e) {
                const data = e?.response?.data;

                const msg =
                  data?.error ||
                  (Array.isArray(data?.details) && data.details.length
                    ? data.details.map((d) => d.message).join(", ")
                    : null) ||
                  "Register failed";

                setErr(msg);
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          <div className="mt-3 text-muted small">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
