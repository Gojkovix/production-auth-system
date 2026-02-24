import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { me } from "../controllers/user.controller.js";

const r = Router();

r.get("/me", requireAuth, me);
r.get("/admin/ping", requireAuth, requireRole("admin"), (req, res) =>
  res.json({ ok: true }),
);

export default r;
