import "dotenv/config";

function req(key) {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env var: ${key}`);
  return v;
}

function opt(key, fallback = undefined) {
  const v = process.env[key];
  return v ?? fallback;
}

export const env = {
  nodeEnv: opt("NODE_ENV", "development"),
  port: Number(opt("PORT", "5000")),

  mongoUri: req("MONGO_URI"),

  appUrl: opt("APP_URL", "http://localhost:5173"),
  apiUrl: opt("API_URL", "http://localhost:5000"),

  corsOrigins: opt("CORS_ORIGINS", "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  jwtAccessSecret: req("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: req("JWT_REFRESH_SECRET"),
  jwtAccessExpiresIn: opt("JWT_ACCESS_EXPIRES_IN", "15m"),
  jwtRefreshExpiresIn: opt("JWT_REFRESH_EXPIRES_IN", "7d"),

  // MAIL CONFIG
  mailMode: opt("MAIL_MODE", "dev"), // "dev" | "smtp"
  smtpHost: opt("SMTP_HOST"),
  smtpPort: Number(opt("SMTP_PORT", "465")),
  smtpSecure: String(opt("SMTP_SECURE", "true")) === "true",
  smtpUser: opt("SMTP_USER"),
  smtpPass: opt("SMTP_PASS"),
  mailFrom: opt("MAIL_FROM"),
};

if (env.mailMode === "smtp") {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    throw new Error("MAIL_MODE=smtp but SMTP_* vars are missing");
  }
}
