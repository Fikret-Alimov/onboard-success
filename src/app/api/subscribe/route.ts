import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { notify } from "@/lib/notify";

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    const { error } = await supabase
      .from("subscribers")
      .insert({ email, source: source || "website" });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "already_subscribed" }, { status: 409 });
      }
      return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
    }

    notify(
      `📬 New Subscriber: ${email}`,
      `New newsletter signup on OnboardSuccess:\n\nEmail: ${email}\nSource: ${source || "website"}`
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
