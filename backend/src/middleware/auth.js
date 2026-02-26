import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing access token" });

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    req.auth = payload; // { sub, role, iat, exp }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid access token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.auth?.role !== "admin")
    return res.status(403).json({ error: "Admin only" });
  next();
}
