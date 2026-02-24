import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let cachedTransporter = null;
console.log("MAIL_MODE =", env.mailMode);
console.log("SMTP_USER =", env.smtpUser);
console.log("SMTP_HOST =", env.smtpHost);
console.log("SMTP_PORT =", env.smtpPort);
console.log("SMTP_SECURE =", env.smtpSecure);
console.log("SMTP_PASS set? =", Boolean(env.smtpPass));

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  return cachedTransporter;
}

export async function sendEmail({ to, subject, html }) {
  if (env.mailMode !== "smtp") {
    console.log("DEV_EMAIL_TO:", to);
    console.log("DEV_EMAIL_SUBJECT:", subject);
    console.log("DEV_EMAIL_HTML:", html);
    return;
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from: env.mailFrom,
    to,
    subject,
    html,
  });
}
