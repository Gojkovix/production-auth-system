import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { listUsers, updateUser } from "../controllers/admin.controller.js";

const r = Router();

r.use(requireAuth, requireRole("admin"));

r.get("/users", listUsers);
r.patch("/users/:id", updateUser);

export default r;
