import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../lib/auth.js";

export default function ResetPassword() {
  const [sp] = useSearchParams();
  const token = sp.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h1 className="h3 mb-3">Reset password</h1>

      {err && <div className="alert alert-danger">{err}</div>}
      {ok && (
        <div className="alert alert-success">
          Password updated. <Link to="/login">Go to login</Link>
        </div>
      )}

      {!token && (
        <div className="alert alert-warning">Missing token in URL.</div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">New password</label>
            <input
              className="form-control"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button
            className="btn btn-dark w-100"
            disabled={loading || !token}
            onClick={async () => {
              setErr("");
              setOk(false);
              setLoading(true);
              try {
                await resetPassword(token, newPassword);
                setOk(true);
              } catch (e) {
                setErr(e?.response?.data?.error || "Request failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Updating..." : "Update password"}
          </button>

          <div className="mt-3 text-muted small">
            Back to <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
