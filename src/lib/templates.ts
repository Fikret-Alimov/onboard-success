import fs from "fs";
import path from "path";

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  platform: string;
  difficulty: string;
  setupTime: string;
  integrations: string[];
  tier: "free" | "pro";
  version: string;
  lastUpdated: string;
  downloads: number;
}

export interface TemplateDetail extends TemplateMeta {
  readme: string;
}

const TEMPLATES_DIR = path.join(process.cwd(), "content", "templates");

export function getAllTemplates(): TemplateMeta[] {
  const slugs = fs.readdirSync(TEMPLATES_DIR).filter((f) => {
    return fs.statSync(path.join(TEMPLATES_DIR, f)).isDirectory();
  });

  const templates: TemplateMeta[] = slugs.map((slug) => {
    const metaPath = path.join(TEMPLATES_DIR, slug, "meta.json");
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    return meta as TemplateMeta;
  });

  // Sort: pro/featured first, then by name
  return templates.sort((a, b) => {
    if (a.tier === "pro" && b.tier !== "pro") return -1;
    if (a.tier !== "pro" && b.tier === "pro") return 1;
    return a.name.localeCompare(b.name);
  });
}

export function getTemplateBySlug(slug: string): TemplateDetail | null {
  const templateDir = path.join(TEMPLATES_DIR, slug);
  if (!fs.existsSync(templateDir)) return null;

  const metaPath = path.join(templateDir, "meta.json");
  const readmePath = path.join(templateDir, "README.md");

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as TemplateMeta;
  const readme = fs.existsSync(readmePath)
    ? fs.readFileSync(readmePath, "utf-8")
    : "";

  return { ...meta, readme };
}

export function getTemplateWorkflow(slug: string): string | null {
  const workflowPath = path.join(TEMPLATES_DIR, slug, "workflow.json");
  if (!fs.existsSync(workflowPath)) return null;
  return fs.readFileSync(workflowPath, "utf-8");
}

export function getTemplateWorkflowData(slug: string): { nodes: any[]; connections: any } | null {
  const workflowPath = path.join(TEMPLATES_DIR, slug, "workflow.json");
  if (!fs.existsSync(workflowPath)) return null;
  const data = JSON.parse(fs.readFileSync(workflowPath, "utf-8"));
  return { nodes: data.nodes || [], connections: data.connections || {} };
}
