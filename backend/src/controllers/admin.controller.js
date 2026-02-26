import { z } from "zod";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";

export async function listUsers(req, res) {
  const users = await User.find({})
    .select("_id email role emailVerified disabled createdAt lastLoginAt")
    .sort({ createdAt: -1 });

  res.json({ users });
}

const UpdateSchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
  disabled: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
});

export async function updateUser(req, res) {
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: "Validation failed" });

  const u = await User.findByIdAndUpdate(
    req.params.id,
    { $set: parsed.data },
    { new: true },
  ).select("_id email role emailVerified disabled createdAt lastLoginAt");

  if (!u) return res.status(404).json({ error: "User not found" });
  res.json({ user: u });
}

// "Trenutno prijavljeni": vsi refresh tokeni, ki niso revoked in niso expired
export async function activeSessions(req, res) {
  const tokens = await RefreshToken.find({
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  })
    .select("userId createdAt expiresAt ip userAgent")
    .sort({ createdAt: -1 })
    .lean();

  const userIds = [...new Set(tokens.map((t) => String(t.userId)))];
  const users = await User.find({ _id: { $in: userIds } })
    .select("_id email role")
    .lean();

  const byId = new Map(users.map((u) => [String(u._id), u]));
  const sessions = tokens.map((t) => ({
    ...t,
    user: byId.get(String(t.userId)) || null,
  }));

  res.json({ sessions });
}
