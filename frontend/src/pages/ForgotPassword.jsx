import { useState } from "react";
import { forgotPassword } from "../lib/auth.js";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ ok: false, err: "", loading: false });

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h1 className="h3 mb-3">Forgot password</h1>

      {state.err && <div className="alert alert-danger">{state.err}</div>}
      {state.ok && (
        <div className="alert alert-success">
          If the email exists, a reset link was sent. (In dev mode you’ll see
          the link in backend console.)
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
            disabled={state.loading}
            onClick={async () => {
              setState({ ok: false, err: "", loading: true });
              try {
                await forgotPassword(email);
                setState({ ok: true, err: "", loading: false });
              } catch (e) {
                setState({
                  ok: false,
                  err: e?.response?.data?.error || "Request failed",
                  loading: false,
                });
              }
            }}
          >
            {state.loading ? "Sending..." : "Send reset link"}
          </button>

          <div className="mt-3 text-muted small">
            Back to <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
