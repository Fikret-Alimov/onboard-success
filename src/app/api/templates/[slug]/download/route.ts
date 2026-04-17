import { NextRequest, NextResponse } from "next/server";
import { getTemplateBySlug, getTemplateWorkflow } from "@/lib/templates";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const template = getTemplateBySlug(slug);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  // Block pro templates without auth
  if (template.tier === "pro") {
    return NextResponse.json(
      { error: "Pro access required. Coming soon — $29/mo for all Pro templates." },
      { status: 403 }
    );
  }

  const workflow = getTemplateWorkflow(slug);
  if (!workflow) {
    return NextResponse.json(
      { error: "Workflow file not found" },
      { status: 404 }
    );
  }

  // Email is required for free templates
  const email = request.nextUrl.searchParams.get("email")?.trim() || null;
  if (!email) {
    return NextResponse.json(
      { error: "Email is required to download templates." },
      { status: 400 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  try {
    // Log download
    await supabase.from("template_downloads").insert({
      template_id: slug,
      email,
      ip_address: ip,
    });

    // Upsert to subscribers table (don't overwrite existing records)
    await supabase.from("subscribers").upsert(
      {
        email,
        source: "template-download",
        active: true,
      },
      { onConflict: "email", ignoreDuplicates: true }
    );
  } catch {
    // Don't block download if logging fails
  }

  return new NextResponse(workflow, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${slug}-workflow.json"`,
    },
  });
}
