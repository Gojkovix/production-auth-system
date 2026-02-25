import { User } from "../models/User.js";
import { z } from "zod";

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
