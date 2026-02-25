import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import User from "../src/models/User.js";

await mongoose.connect(env.mongoUri);

const email = "langojkovic.dev@gmail.com";
const u = await User.findOneAndUpdate(
  { email },
  { $set: { role: "admin" } },
  { new: true },
);

console.log("Updated:", u?.email, u?.role);
process.exit(0);
