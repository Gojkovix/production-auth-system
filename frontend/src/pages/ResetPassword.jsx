import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../lib/auth.js";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [state, setState] = useState({ ok: false, err: "", loading: false });

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h1 className="h3 mb-3">Reset password</h1>

      {!token && <div className="alert alert-danger">Missing token.</div>}
      {state.err && <div className="alert alert-danger">{state.err}</div>}
      {state.ok && (
        <div className="alert alert-success">
          Password updated. <Link to="/login">Login</Link>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">New password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!token}
            />
          </div>

          <button
            className="btn btn-dark w-100"
            disabled={!token || state.loading}
            onClick={async () => {
              setState({ ok: false, err: "", loading: true });
              try {
                await resetPassword(token, password);
                setState({ ok: true, err: "", loading: false });
              } catch (e) {
                setState({
                  ok: false,
                  err: e?.response?.data?.error || "Reset failed",
                  loading: false,
                });
              }
            }}
          >
            {state.loading ? "Updating..." : "Update password"}
          </button>

          <div className="mt-3 text-muted small">
            Back to <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
