import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  listUsers,
  updateUser,
  activeSessions,
} from "../controllers/admin.controller.js";

const r = Router();

r.use(requireAuth);
r.use(requireRole("admin"));

r.get("/users", listUsers);
r.patch("/users/:id", updateUser);
r.get("/sessions", activeSessions);

export default r;
