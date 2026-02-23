import { env } from "../config/env.js";

export async function sendEmail({ to, subject, html }) {
  if (env.nodeEnv !== "production") {
    console.log("DEV_EMAIL_TO:", to);
    console.log("DEV_EMAIL_SUBJECT:", subject);
    console.log("DEV_EMAIL_HTML:", html);
    return;
  }

  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.default.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
  });
}
