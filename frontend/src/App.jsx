import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.js";
import ResetPassword from "./pages/ResetPassword.js";
import { bootstrapSession, logout } from "./lib/auth.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const u = await bootstrapSession();
        if (alive) setUser(u);
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setReady(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (!ready) return <div className="p-4">Loading...</div>;

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Auth System
          </Link>
          <div className="d-flex gap-2">
            {!user ? (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  Login
                </Link>
                <Link className="btn btn-warning btn-sm" to="/register">
                  Register
                </Link>
              </>
            ) : (
              <button
                className="btn btn-outline-light btn-sm"
                onClick={async () => {
                  await logout();
                  setUser(null);
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />

        <Route path="/login" element={<Login onAuthed={(u) => setUser(u)} />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Email flows */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
