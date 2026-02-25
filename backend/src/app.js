import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import User from "./models/User.js";
import { z } from "zod";
import adminRoutes from "./routes/admin.routes.js";

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

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  const corsOptions = {
    origin: (origin, cb) => {
      // allow tools like curl/postman + same-origin
      if (!origin) return cb(null, true);

      const allowed = env.corsOrigins.includes(origin);
      // IMPORTANT: don't throw errors here (preflight must not crash)
      return cb(null, allowed);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));

  //Explicitly handle preflight for all routes
  app.options("*", cors(corsOptions));

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/admin", adminRoutes);

  // generic error handler
  app.use((err, req, res, next) => {
    const msg = err?.message || "Server error";
    res.status(500).json({ error: msg });
  });

  return app;
}
