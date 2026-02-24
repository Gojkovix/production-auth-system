import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true);
        if (env.corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("CORS blocked: " + origin));
      },
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true,
    }),
  );

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);

  app.use((err, req, res, next) => {
    const msg = err?.message || "Server error";
    const status = msg.startsWith("CORS blocked") ? 403 : 500;
    res.status(status).json({ error: msg });
  });

  return app;
}
