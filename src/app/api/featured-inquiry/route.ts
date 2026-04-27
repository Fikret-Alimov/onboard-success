import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

async function sendNotification(listingName: string, email: string, message: string | null) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
      subject: `🌟 New Featured Listing Inquiry: ${listingName}`,
      text: [
        `New featured listing inquiry on OnboardSuccess:`,
        ``,
        `Company: ${listingName}`,
        `Email: ${email}`,
        `Message: ${message || "(none)"}`,
        ``,
        `Time: ${new Date().toISOString()}`,
        ``,
        `Reply to ${email} with pricing details and Stripe payment link.`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("Failed to send notification email:", err);
    // Don't block the response — notification is best-effort
  }
}

export async function POST(req: NextRequest) {
  try {
    const { listingName, email, message } = await req.json();

    if (!listingName || !email) {
      return NextResponse.json(
        { error: "Company name and email are required." },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("featured_inquiries").insert({
      listing_name: listingName,
      email,
      message: message || null,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit inquiry. Please try again." },
        { status: 500 }
      );
    }

    // Send notification email (non-blocking)
    sendNotification(listingName, email, message || null);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
