import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { notify } from "@/lib/notify";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, category, message, company, role, integrator, listing } = data;

    if (!name || !email || !category || !message) {
      return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
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

    notify(
      `${emoji} Contact Form: ${category} — ${name}`,
      `New contact submission on OnboardSuccess:\n\nName: ${name}\nEmail: ${email}\nCategory: ${category}\nCompany: ${company || "-"}\nRole: ${role || "-"}${extra}\n\nMessage:\n${message}`
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
