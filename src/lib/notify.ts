import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "smtpout.secureserver.net",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function notify(subject: string, body: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP not configured — skipping notification");
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
      subject,
      text: body,
    });
  } catch (err) {
    console.error("Notification email failed:", err);
  }
}
