import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let cachedTransporter = null;

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
