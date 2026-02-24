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

  // generic error handler
  app.use((err, req, res, next) => {
    const msg = err?.message || "Server error";
    res.status(500).json({ error: msg });
  });

  return app;
}
