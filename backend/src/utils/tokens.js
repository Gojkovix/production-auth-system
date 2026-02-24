import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role },
    env.jwtAccessSecret,
    { expiresIn: env.accessTtl },
  );
}

export function signRefreshTokenJwt(user) {
  return jwt.sign(
    { sub: String(user._id), typ: "refresh" },
    env.jwtRefreshSecret,
    { expiresIn: env.refreshTtl },
  );
}

export function verifyRefreshJwt(token) {
  const payload = jwt.verify(token, env.jwtRefreshSecret);
  if (payload.typ !== "refresh") throw new Error("Invalid refresh token type");
  return payload;
}

export function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function randomToken() {
  return crypto.randomBytes(32).toString("hex");
}
