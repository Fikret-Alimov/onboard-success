#!/usr/bin/env node
/**
 * OnboardSuccess Batch Content Generator
 * Uses OpenAI Batch API (50% discount) to generate:
 * - 10 playbook articles (MDX)
 * - agents.json (structured data for 10 tools)
 * - integrators.json (structured data for 10 agencies)
 * - GTM strategy document
 */

const fs = require('fs');
const path = require('path');

const BATCH_DIR = __dirname;
const CONTENT_DIR = path.join(__dirname, '../../content');
const INBOUND_DIR = '/home/rickcl/.openclaw/media/inbound';

// Load source files
const articleTopics = fs.readFileSync(path.join(INBOUND_DIR, '01_cs_ai_article_topics---3366d113-e568-4b32-8196-3902c1860659.txt'), 'utf-8');
const agentsSrc = fs.readFileSync(path.join(INBOUND_DIR, '02_cs_ai_solutions_directory---3b945a7e-7ffc-457e-97df-88da7a0e698c.txt'), 'utf-8');
const integratorsSrc = fs.readFileSync(path.join(INBOUND_DIR, '03_cs_ai_agencies_directory---fbb18e67-f330-43d6-ac4c-36c75a787373.txt'), 'utf-8');

// Article slugs mapping
const articles = [
  { id: 'article-1', slug: 'from-insight-to-action', title: 'From Insight to Action: How Agentic AI Is Replacing the CS Playbook' },
  { id: 'article-2', slug: 'long-tail-problem', title: 'The Long-Tail Problem: How AI Agents Are Finally Solving 1:Many Customer Success' },
  { id: 'article-3', slug: 'ai-health-scores-2026', title: 'AI Health Scores in 2026: Why Your Current Model Is Already Obsolete' },
  { id: 'article-4', slug: 'qbr-by-agent', title: 'QBR to QBR-by-Agent: Automating the Business Review Prep Stack' },
  { id: 'article-5', slug: 'cs-ai-stack-2026', title: 'The CS AI Stack in 2026: What to Buy, Build, and Abandon' },
  { id: 'article-6', slug: 'autonomous-onboarding', title: 'Autonomous Onboarding: How to Deploy AI Agents Across the First 90 Days' },
  { id: 'article-7', slug: 'churn-signals-2026', title: 'Churn Signals in 2026: What AI Detects Before Your CSM Does' },
  { id: 'article-8', slug: 'cs-roi-ai-2026', title: 'From Cost Center to Revenue Center: Using AI to Prove CS ROI in 2026' },
  { id: 'article-9', slug: 'agents-vs-copilots', title: 'AI Agents vs AI Copilots: A CS Practitioner\'s Guide to Knowing the Difference' },
  { id: 'article-10', slug: 'building-custom-cs-agents', title: 'Building Custom CS Agents in 2026: When to Go Platform-Native vs DIY' },
];

const requests = [];

// --- PLAYBOOK ARTICLES (10 requests) ---
// Split the source file into individual article blocks
const articleBlocks = articleTopics.split(/Article \d+:/g).filter(b => b.trim());

for (let i = 0; i < articles.length; i++) {
  const article = articles[i];
  const block = articleBlocks[i] || '';
  
  requests.push({
    custom_id: article.id,
    method: 'POST',
    url: '/v1/chat/completions',
    body: {
      model: 'gpt-4.1',
      max_tokens: 4000,
      messages: [
        {
          role: 'system',
          content: `You are an expert content writer for OnboardSuccess.com, a resource hub for mid-market B2B SaaS Customer Success teams operationalizing AI. Write authoritative, practical, SEO-optimized articles. Tone: professional but not dry, data-driven, practitioner-focused. No fluff. No generic AI hype. Write for CS leaders and practitioners who are actively evaluating or deploying agentic AI.

Output format: Return ONLY valid MDX content. Start with frontmatter block:
---
title: "${article.title}"
date: "2026-03-31"
description: "[write a compelling 1-2 sentence meta description]"
tags: [relevant tags as array]
---

Then the full article body in markdown. Use ## for main sections, ### for subsections. Include practical examples, data points, and actionable takeaways. Target 1800-2500 words.`
        },
        {
          role: 'user',
          content: `Write a full article based on this outline:\n\nTitle: ${article.title}\n\n${block}\n\nMake it authoritative, practical, and SEO-optimized. Reference specific tools and data points from the outline. This is for onboard-success.com (a CS AI resource hub), not nocodelisted.com.`
        }
      ]
    }
  });
}

// --- AGENTS JSON (1 request) ---
requests.push({
  custom_id: 'agents-json',
  method: 'POST',
  url: '/v1/chat/completions',
  body: {
    model: 'gpt-4.1',
    max_tokens: 4000,
    messages: [
      {
        role: 'system',
        content: `You are a data structuring assistant. Convert the provided tool descriptions into a JSON array for a directory website. Each tool should be an object with these exact fields:
{
  "id": "kebab-case-id",
  "name": "Tool Name",
  "category": "one of: CS Platform, AI-Native Platform, Support AI, CX Operations, Relationship Intelligence, Digital CS, Autonomous Agent",
  "description": "One-line description (max 120 chars)",
  "longDescription": "2-3 sentence detailed description",
  "bestFor": "Who this tool is best for (1 sentence)",
  "g2Rating": "4.7/5",
  "g2Reviews": "680+",
  "pricing": "Brief pricing info",
  "website": "https://...",
  "affiliateUrl": "",
  "integrations": ["Salesforce", "Zendesk", etc],
  "features": ["key feature 1", "key feature 2", "key feature 3"]
}

Return ONLY the JSON array, no markdown fences, no explanation.`
      },
      {
        role: 'user',
        content: `Convert these 10 CS AI tools into the JSON format:\n\n${agentsSrc}`
      }
    ]
  }
});

// --- INTEGRATORS JSON (1 request) ---
requests.push({
  custom_id: 'integrators-json',
  method: 'POST',
  url: '/v1/chat/completions',
  body: {
    model: 'gpt-4.1',
    max_tokens: 4000,
    messages: [
      {
        role: 'system',
        content: `You are a data structuring assistant. Convert the provided agency descriptions into a JSON array for a directory website. Each agency should be an object with these exact fields:
{
  "id": "kebab-case-id",
  "name": "Agency Name",
  "type": "one of: Implementation Partner, Strategy Consultant, Revenue Architecture, CX Consulting, Enterprise AI, RevOps, Methodology",
  "location": "Country/Region",
  "description": "2-3 sentence description",
  "specialties": ["specialty1", "specialty2", ...],
  "website": "https://...",
  "contactUrl": "direct contact URL or website",
  "featured": false,
  "featuredUntil": "",
  "featuredBadge": ""
}

Return ONLY the JSON array, no markdown fences, no explanation.`
      },
      {
        role: 'user',
        content: `Convert these 10 CS AI agencies/integrators into the JSON format:\n\n${integratorsSrc}`
      }
    ]
  }
});

// --- GTM STRATEGY (1 request) ---
requests.push({
  custom_id: 'gtm-strategy',
  method: 'POST',
  url: '/v1/chat/completions',
  body: {
    model: 'gpt-4.1',
    max_tokens: 4000,
    messages: [
      {
        role: 'system',
        content: `You are a B2B SaaS go-to-market strategist specializing in content-led growth and niche directory businesses. Create a comprehensive GTM strategy document.`
      },
      {
        role: 'user',
        content: `Create a detailed GTM strategy for OnboardSuccess.com.

About the site:
- Resource hub for mid-market B2B SaaS Customer Success teams operationalizing AI
- Three sections: /playbooks (articles), /agents (AI tool directory), /integrators (agency directory)
- Revenue model: Featured integrator listings ($39-79/mo), affiliate links on agent tools, sponsored playbooks ($500-2k), "Request a Quote" lead gen for integrators
- Target audience: CS Leaders, VPs of CS, CS Ops, CCOs at mid-market B2B SaaS companies
- Company: Onboard Success OÜ (Estonia-registered)

The GTM strategy should cover:
1. Launch plan (first 30/60/90 days)
2. SEO strategy (target keywords, content clusters, link building)
3. Distribution channels (LinkedIn, Reddit, communities, newsletters)
4. Outreach plan for tool vendors (to populate /agents with affiliate links)
5. Outreach plan for agencies (to populate /integrators and convert to featured listings)
6. Content calendar (first 3 months)
7. Email list growth tactics
8. Partnership opportunities
9. Metrics to track
10. Budget estimate (lean, <$500/month)

Be specific and actionable. No generic advice. This needs to be executable by a solo founder with AI assistance.

Output as a well-structured markdown document.`
      }
    ]
  }
});

// Write JSONL file
const jsonlPath = path.join(BATCH_DIR, 'batch-requests.jsonl');
const jsonl = requests.map(r => JSON.stringify(r)).join('\n');
fs.writeFileSync(jsonlPath, jsonl);

console.log(`✅ Generated ${requests.length} batch requests → ${jsonlPath}`);
console.log(`   - 10 playbook articles`);
console.log(`   - 1 agents.json`);
console.log(`   - 1 integrators.json`);
console.log(`   - 1 GTM strategy`);
console.log(`\nNext: run submit-batch.js to upload and submit to OpenAI Batch API`);
