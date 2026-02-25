import { useState } from "react";
import { forgotPassword } from "../lib/auth.js";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h1 className="h3 mb-3">Forgot password</h1>

      {err && <div className="alert alert-danger">{err}</div>}
      {ok && (
        <div className="alert alert-success">
          If the email exists, a reset link was sent.
        </div>
      )}

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

          <button
            className="btn btn-warning w-100"
            disabled={loading}
            onClick={async () => {
              setErr("");
              setOk(false);
              setLoading(true);
              try {
                await forgotPassword(email);
                setOk(true);
              } catch (e) {
                setErr(e?.response?.data?.error || "Request failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <div className="mt-3 text-muted small">
            Back to <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
