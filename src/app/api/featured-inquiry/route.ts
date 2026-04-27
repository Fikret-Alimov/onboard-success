import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { notify } from "@/lib/notify";

export async function POST(req: NextRequest) {
  try {
    const { listingName, email, message } = await req.json();

    if (!listingName || !email) {
      return NextResponse.json(
        { error: "Company name and email are required." },
        { status: 400 }
      );
    }

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

    notify(
      `🌟 New Featured Listing Inquiry: ${listingName}`,
      `New featured listing inquiry on OnboardSuccess:\n\nCompany: ${listingName}\nEmail: ${email}\nMessage: ${message || "(none)"}\n\nReply to ${email} with pricing details and Stripe payment link.`
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
