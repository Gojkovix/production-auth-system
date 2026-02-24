import bcrypt from "bcrypt";
import { z } from "zod";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { env } from "../config/env.js";
import { createEmailToken } from "../utils/emailTokens.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  signAccessToken,
  signRefreshTokenJwt,
  verifyRefreshJwt,
  sha256,
} from "../utils/tokens.js";

export const schemas = {
  register: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(72),
  }),
  login: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(72),
  }),
  verifyEmail: z.object({
    token: z.string().min(10),
  }),
  forgotPassword: z.object({
    email: z.string().email(),
  }),
  resetPassword: z.object({
    token: z.string().min(10),
    newPassword: z.string().min(8).max(72),
  }),
};

function setRefreshCookie(res, refreshJwt) {
  res.cookie(env.cookieNameRefresh, refreshJwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    path: "/auth/refresh",
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(env.cookieNameRefresh, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    path: "/auth/refresh",
  });
}

export async function register(req, res) {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 12);

  const { token, tokenHash, exp } = createEmailToken(6);

  const user = await User.create({
    email,
    passwordHash,
    verifyEmailTokenHash: tokenHash,
    verifyEmailTokenExp: exp,
  });

  const verifyUrl = `${env.appUrl}/verify-email?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: `<p>Click to verify:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
  });

  return res.status(201).json({ ok: true });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = signAccessToken(user);
  const refreshJwt = signRefreshTokenJwt(user);

  const tokenHash = sha256(refreshJwt);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    expiresAt,
    userAgent: req.headers["user-agent"] || "",
    ip: req.ip || "",
  });

  setRefreshCookie(res, refreshJwt);

  return res.json({
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  });
}

export async function refresh(req, res) {
  const refreshJwt = req.cookies[env.cookieNameRefresh];
  if (!refreshJwt)
    return res.status(401).json({ error: "Missing refresh cookie" });

  let payload;
  try {
    payload = verifyRefreshJwt(refreshJwt);
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  const oldHash = sha256(refreshJwt);
  const tokenDoc = await RefreshToken.findOne({ tokenHash: oldHash });

  if (!tokenDoc || tokenDoc.revokedAt)
    return res.status(401).json({ error: "Refresh revoked" });
  if (tokenDoc.expiresAt < new Date())
    return res.status(401).json({ error: "Refresh expired" });

  const user = await User.findById(payload.sub);
  if (!user) return res.status(401).json({ error: "User not found" });

  const newRefreshJwt = signRefreshTokenJwt(user);
  const newHash = sha256(newRefreshJwt);

  tokenDoc.revokedAt = new Date();
  tokenDoc.replacedByTokenHash = newHash;
  await tokenDoc.save();

  await RefreshToken.create({
    userId: user._id,
    tokenHash: newHash,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userAgent: req.headers["user-agent"] || "",
    ip: req.ip || "",
  });

  setRefreshCookie(res, newRefreshJwt);

  const accessToken = signAccessToken(user);
  return res.json({ accessToken });
}

export async function logout(req, res) {
  const refreshJwt = req.cookies[env.cookieNameRefresh];
  if (refreshJwt) {
    const hash = sha256(refreshJwt);
    await RefreshToken.updateOne(
      { tokenHash: hash },
      { $set: { revokedAt: new Date() } },
    );
  }
  clearRefreshCookie(res);
  return res.json({ ok: true });
}

export async function verifyEmail(req, res) {
  const { token } = req.body;
  const tokenHash = sha256(token);

  const user = await User.findOne({
    verifyEmailTokenHash: tokenHash,
    verifyEmailTokenExp: { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  user.emailVerified = true;
  user.verifyEmailTokenHash = null;
  user.verifyEmailTokenExp = null;
  await user.save();

  return res.json({ ok: true });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.json({ ok: true });

  const { token, tokenHash, exp } = createEmailToken(2);

  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordTokenExp = exp;
  await user.save();

  const resetUrl = `${env.appUrl}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `<p>Reset link:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  return res.json({ ok: true });
}

export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  const tokenHash = sha256(token);

  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordTokenExp: { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.resetPasswordTokenHash = null;
  user.resetPasswordTokenExp = null;
  await user.save();

  await RefreshToken.updateMany(
    { userId: user._id },
    { $set: { revokedAt: new Date() } },
  );

  return res.json({ ok: true });
}
