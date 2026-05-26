import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getTemplateBySlug, getTemplateWorkflow } from "@/lib/templates";
import { supabase } from "@/lib/supabase";
import { notify } from "@/lib/notify";

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

  const assetType = template.assetType || "workflow";

  // Resolve the asset bytes + content-type up front so we don't insert a
  // subscriber record when the file is missing.
  let body: ArrayBuffer | string | null = null;
  let contentType = "application/octet-stream";
  let filename = template.downloadFilename || `${slug}.bin`;

  if (assetType === "workflow") {
    const workflow = getTemplateWorkflow(slug);
    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow file not found" },
        { status: 404 }
      );
    }
    body = workflow;
    contentType = "application/json";
    filename = template.downloadFilename || `${slug}-workflow.json`;
  } else if (assetType === "pdf") {
    if (!template.assetPath) {
      return NextResponse.json(
        { error: "Asset path not configured" },
        { status: 500 }
      );
    }
    // assetPath is rooted at /public (e.g. "/downloads/foo.pdf"). Strip
    // any leading slash and join under process.cwd()/public.
    const rel = template.assetPath.replace(/^\/+/, "");
    const filePath = path.join(process.cwd(), "public", rel);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Asset file not found" },
        { status: 404 }
      );
    }
    const buf = fs.readFileSync(filePath);
    // Copy into a fresh ArrayBuffer to satisfy BodyInit typing.
    const ab = new ArrayBuffer(buf.byteLength);
    new Uint8Array(ab).set(buf);
    body = ab;
    contentType = "application/pdf";
    filename = template.downloadFilename || path.basename(filePath);
  } else {
    return NextResponse.json(
      { error: `Unsupported assetType: ${assetType}` },
      { status: 400 }
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
    await notify(
      `📥 Template Download: ${template.name}`,
      `Template downloaded on OnboardSuccess:\n\nTemplate: ${template.name} (${slug})\nEmail: ${email}\nIP: ${ip}`
    );
  } catch {
    // Don't block download if logging fails
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
