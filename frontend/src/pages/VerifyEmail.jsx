import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../lib/auth.js";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState({ loading: true, ok: false, msg: "" });

  useEffect(() => {
    (async () => {
      if (!token) {
        setState({ loading: false, ok: false, msg: "Missing token." });
        return;
      }

      try {
        await verifyEmail(token);
        setState({
          loading: false,
          ok: true,
          msg: "Email verified successfully.",
        });
      } catch (e) {
        setState({
          loading: false,
          ok: false,
          msg: e?.response?.data?.error || "Verification failed.",
        });
      }
    })();
  }, [token]);

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <h1 className="h3 mb-3">Verify Email</h1>

      {state.loading && (
        <div className="alert alert-secondary">Verifying...</div>
      )}
      {!state.loading && state.ok && (
        <div className="alert alert-success">{state.msg}</div>
      )}
      {!state.loading && !state.ok && (
        <div className="alert alert-danger">{state.msg}</div>
      )}

      <div className="mt-3">
        <Link to="/login" className="btn btn-dark btn-sm">
          Go to login 
        </Link>
      </div>
    </div>
  );
}
