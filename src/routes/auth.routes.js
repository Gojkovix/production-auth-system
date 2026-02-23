import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiters.js";
import {
  schemas,
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const r = Router();

r.post("/register", authLimiter, validate(schemas.register), register);
r.post("/login", authLimiter, validate(schemas.login), login);
r.post("/refresh", refresh);
r.post("/logout", logout);

r.post("/verify-email", validate(schemas.verifyEmail), verifyEmail);
r.post(
  "/forgot-password",
  authLimiter,
  validate(schemas.forgotPassword),
  forgotPassword,
);
r.post(
  "/reset-password",
  authLimiter,
  validate(schemas.resetPassword),
  resetPassword,
);

export default r;
