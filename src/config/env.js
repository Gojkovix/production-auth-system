import dotenv from "dotenv";
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),

  mongoUri: process.env.MONGO_URI,

  appUrl: process.env.APP_URL,
  apiUrl: process.env.API_URL,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTtl: process.env.ACCESS_TOKEN_TTL || "15m",
  refreshTtl: process.env.REFRESH_TOKEN_TTL || "30d",

  cookieNameRefresh: process.env.COOKIE_NAME_REFRESH || "refresh_token",

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM,
  },

  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};

const required = [
  "mongoUri",
  "jwtAccessSecret",
  "jwtRefreshSecret",
  "appUrl",
  "apiUrl",
];

for (const key of required) {
  if (!env[key]) throw new Error(`Missing env var: ${key}`);
}
