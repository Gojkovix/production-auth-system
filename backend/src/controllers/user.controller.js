import { User } from "../models/User.js";

export async function me(req, res) {
  const user = await User.findById(req.auth.userId).select(
    "email role emailVerified createdAt",
  );
  return res.json({ user });
}
