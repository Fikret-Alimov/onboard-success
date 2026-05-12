import { createTransport } from "nodemailer";

export async function notify(subject: string, body: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[notify] SMTP not configured — skipping notification");
    return;
  }
  console.log(
    `[notify] sending subject="${subject}" to=${process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER}`
  );
  // Build transporter per-call so serverless cold-start doesn't reuse a dead socket
  const transporter = createTransport({
    host: "smtpout.secureserver.net",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
      subject,
      text: body,
    });
    console.log(`[notify] sent ok messageId=${info.messageId}`);
  } catch (err) {
    console.error("[notify] send failed:", err);
  }
}
