import { useEffect, useState } from "react";
import { me } from "../lib/auth.js";

export default function Dashboard({ user }) {
  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="h4 mb-2">Dashboard</h1>
              <p className="text-muted mb-0">
                Protected page (requires valid access token).
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h6 text-uppercase text-muted">Session</h2>
              <pre className="mb-0">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
