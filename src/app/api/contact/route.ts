import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { notify } from "@/lib/notify";

// Lightweight spam detection
function isSpam(data: {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
  role?: string;
  website?: string;
  ts?: number;
}): { spam: boolean; reason?: string } {
  // 1. Honeypot — bots fill every visible field
  if (data.website && data.website.trim().length > 0) {
    return { spam: true, reason: "honeypot" };
  }

  // 2. Time check — bots submit instantly
  if (typeof data.ts === "number" && data.ts > 0) {
    const elapsedMs = Date.now() - data.ts;
    if (elapsedMs < 2000) {
      return { spam: true, reason: "too_fast" };
    }
    // Form older than 6 hours is suspicious (replay/stale tab)
    if (elapsedMs > 6 * 60 * 60 * 1000) {
      return { spam: true, reason: "too_old" };
    }
  }

  const name = (data.name || "").trim();
  const message = (data.message || "").trim();

  // 3. Gibberish name detection (no vowels, no spaces, all consonants)
  // Real names have vowels. Random strings often don't.
  if (name.length >= 8 && name.length <= 40) {
    const stripped = name.replace(/\s/g, "");
    const vowels = (stripped.match(/[aeiouAEIOU]/g) || []).length;
    const letters = (stripped.match(/[a-zA-Z]/g) || []).length;
    // If it's mostly letters and has <15% vowels, likely random
    if (letters >= 8 && vowels / letters < 0.15) {
      return { spam: true, reason: "gibberish_name" };
    }
    // Names without any spaces that are >20 chars are usually fake
    if (!name.includes(" ") && name.length > 20 && letters > 15) {
      return { spam: true, reason: "long_no_space_name" };
    }
  }

  // 4. URL in message — common spam pattern
  const urlPattern = /\b(?:https?:\/\/|www\.)\S+/i;
  if (urlPattern.test(message)) {
    return { spam: true, reason: "url_in_message" };
  }

  // 5. Message gibberish (long string, no spaces)
  if (message.length > 20 && !message.includes(" ")) {
    return { spam: true, reason: "no_spaces_message" };
  }

  // 6. Suspicious BBCode/markup spam
  if (/\[url=|\[link=/i.test(message)) {
    return { spam: true, reason: "bbcode" };
  }

  return { spam: false };
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, category, message, company, role, integrator, listing, website, ts } = data;

    if (!name || !email || !category || !message) {
      return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
    }

    const spamCheck = isSpam({ name, email, message, company, role, website, ts });
    if (spamCheck.spam) {
      // Silent reject — return success so bots don't iterate
      console.log(`[contact] spam blocked: ${spamCheck.reason} from ${email}`);
      return NextResponse.json({ success: true });
    }

    // Insert into contact_submissions
    const { error } = await supabase.from("contact_submissions").insert({
      name, email, category, message,
      company: company || null,
      role: role || null,
      integrator: integrator || null,
      listing: listing || null,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to submit." }, { status: 500 });
    }

    // Additional table inserts for specific categories
    if (category === "Request a Quote") {
      await supabase.from("quote_requests").insert({
        name, email, company: company || null,
        integrator: integrator || null, message,
      });
    }

    if (category === "Claim a Listing") {
      await supabase.from("listing_claims").insert({
        name, email, role: role || null,
        listing: listing || null, message,
      });
    }

    // Build notification
    const emoji = category === "Request a Quote" ? "💰" :
                  category === "Claim a Listing" ? "🏢" :
                  category === "Submit a Tool" ? "🔧" :
                  category === "Submit an Agency" ? "🏗️" :
                  category === "Partnership" ? "🤝" : "📩";

    const extra = integrator ? `\nIntegrator: ${integrator}` :
                  listing ? `\nListing: ${listing}` : "";

    await notify(
      `${emoji} Contact Form: ${category} — ${name}`,
      `New contact submission on OnboardSuccess:\n\nName: ${name}\nEmail: ${email}\nCategory: ${category}\nCompany: ${company || "-"}\nRole: ${role || "-"}${extra}\n\nMessage:\n${message}`
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
