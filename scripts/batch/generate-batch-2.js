#!/usr/bin/env node
/**
 * Batch 2: Comparison pages + expanded directories
 * - 8 comparison articles (programmatic SEO)
 * - 20 more AI tools for agents.json
 * - 15 more agencies for integrators.json
 */

const fs = require('fs');
const path = require('path');

const BATCH_DIR = __dirname;
const requests = [];

// --- COMPARISON PAGES (8 high-intent SEO pages) ---
const comparisons = [
  { id: 'comp-1', slug: 'churnzero-vs-gainsight', tools: ['ChurnZero', 'Gainsight'], keywords: 'churnzero vs gainsight, gainsight alternative, churnzero comparison' },
  { id: 'comp-2', slug: 'gainsight-vs-vitally', tools: ['Gainsight', 'Vitally'], keywords: 'gainsight vs vitally, vitally alternative, mid-market cs platform' },
  { id: 'comp-3', slug: 'churnzero-vs-vitally', tools: ['ChurnZero', 'Vitally'], keywords: 'churnzero vs vitally, best cs platform mid-market' },
  { id: 'comp-4', slug: 'gainsight-vs-oliv-ai', tools: ['Gainsight', 'Oliv.ai'], keywords: 'gainsight vs oliv ai, oliv ai review, gainsight alternative 2026' },
  { id: 'comp-5', slug: 'totango-vs-gainsight', tools: ['Totango', 'Gainsight'], keywords: 'totango vs gainsight 2026, totango alternative' },
  { id: 'comp-6', slug: 'churnzero-vs-oliv-ai', tools: ['ChurnZero', 'Oliv.ai'], keywords: 'churnzero vs oliv ai, ai native cs platform' },
  { id: 'comp-7', slug: 'best-cs-platforms-2026', tools: ['ChurnZero', 'Gainsight', 'Vitally', 'Oliv.ai', 'Velaris'], keywords: 'best customer success platforms 2026, top cs software, cs platform comparison' },
  { id: 'comp-8', slug: 'best-cs-ai-agents-2026', tools: ['ChurnZero AI Agents', 'Gainsight Atlas', 'Oliv.ai Agents', 'Forethought AI'], keywords: 'best ai agents customer success 2026, cs ai tools comparison' },
];

for (const comp of comparisons) {
  requests.push({
    custom_id: comp.id,
    method: 'POST',
    url: '/v1/chat/completions',
    body: {
      model: 'gpt-4.1-mini',
      max_tokens: 3500,
      messages: [
        {
          role: 'system',
          content: `You are an expert B2B SaaS analyst writing for OnboardSuccess.com, a resource hub for mid-market Customer Success teams. Write detailed, fair comparison articles. Be objective — don't pick favorites, highlight genuine strengths and weaknesses. Include pricing where known, G2 ratings, best-for scenarios, and a clear recommendation matrix.

Output as MDX with frontmatter:
---
title: "[comparison title]"
date: "2026-03-31"
description: "[SEO meta description, 150-160 chars]"
tags: [relevant tags]
---

Target 1500-2000 words. Use tables for feature comparisons. Link to /agents for full directory.`
        },
        {
          role: 'user',
          content: `Write a comparison article: ${comp.tools.join(' vs ')}. Target keywords: ${comp.keywords}. For onboard-success.com. Focus on AI/agentic capabilities, mid-market fit, pricing, ease of deployment, and CS ops requirements.`
        }
      ]
    }
  });
}

// --- EXPANDED AGENTS (20 more tools, batch as 2 requests of 10) ---
requests.push({
  custom_id: 'agents-batch-1',
  method: 'POST',
  url: '/v1/chat/completions',
  body: {
    model: 'gpt-4.1-mini',
    max_tokens: 4000,
    messages: [
      {
        role: 'system',
        content: `You are a B2B SaaS researcher. Return a JSON array of 10 AI tools relevant to Customer Success teams. Each object must have:
{"id":"kebab-case","name":"","category":"one of: CS Platform, AI-Native Platform, Support AI, CX Operations, Relationship Intelligence, Digital CS, Autonomous Agent, Revenue Intelligence, Conversation Intelligence, Product Analytics","description":"max 120 chars","longDescription":"2-3 sentences","bestFor":"1 sentence","g2Rating":"X.X/5","g2Reviews":"N+","pricing":"brief","website":"https://...","affiliateUrl":"","integrations":["..."],"features":["..."],"featured":false,"featuredUntil":"","featuredBadge":""}
Return ONLY valid JSON array, no markdown fences.`
      },
      {
        role: 'user',
        content: `Generate 10 real AI tools for CS teams NOT already in our directory. Our existing tools: ChurnZero, Gainsight, Oliv.ai, EverAfter, Staircase AI, Vitally, Forethought, Velaris, Agency.inc, TheLoops. Find 10 MORE real tools from these categories: conversation intelligence (Gong, Chorus), product analytics (Pendo, Amplitude), revenue intelligence (Clari, Gong), support AI (Intercom Fin, Ada), CS-adjacent AI tools. Use real companies with real G2 ratings.`
      }
    ]
  }
});

requests.push({
  custom_id: 'agents-batch-2',
  method: 'POST',
  url: '/v1/chat/completions',
  body: {
    model: 'gpt-4.1-mini',
    max_tokens: 4000,
    messages: [
      {
        role: 'system',
        content: `You are a B2B SaaS researcher. Return a JSON array of 10 AI tools relevant to Customer Success teams. Same format as before:
{"id":"kebab-case","name":"","category":"","description":"max 120 chars","longDescription":"2-3 sentences","bestFor":"1 sentence","g2Rating":"X.X/5","g2Reviews":"N+","pricing":"brief","website":"https://...","affiliateUrl":"","integrations":["..."],"features":["..."],"featured":false,"featuredUntil":"","featuredBadge":""}
Return ONLY valid JSON array, no markdown fences.`
      },
      {
        role: 'user',
        content: `Generate 10 MORE real AI tools for CS teams. Avoid duplicates with: ChurnZero, Gainsight, Oliv.ai, EverAfter, Staircase AI, Vitally, Forethought, Velaris, Agency.inc, TheLoops, Gong, Chorus, Pendo, Amplitude, Clari, Intercom, Ada. Look at: Totango, Planhat, CustomerOS, Catalyst, Freshsuccess, Akita, Churn360, Custify, SmartKarrot, UserIQ, ClientSuccess, Strikedeck, Kapta, ZapScale, Involve.ai. Use real data.`
      }
    ]
  }
});

// --- EXPANDED INTEGRATORS (15 more agencies, batch as 2 requests) ---
requests.push({
  custom_id: 'integrators-batch-1',
  method: 'POST',
  url: '/v1/chat/completions',
  body: {
    model: 'gpt-4.1-mini',
    max_tokens: 3000,
    messages: [
      {
        role: 'system',
        content: `You are a B2B research assistant. Return a JSON array of 8 real CS implementation agencies/consultancies. Each object:
{"id":"kebab-case","name":"","type":"one of: Implementation Partner, Strategy Consultant, Revenue Architecture, CX Consulting, Enterprise AI, RevOps, Methodology, CS Operations, Digital Transformation","location":"Country/Region","description":"2-3 sentences","specialties":["..."],"website":"https://...","contactUrl":"","featured":false,"featuredUntil":"","featuredBadge":""}
Return ONLY valid JSON array, no markdown fences.`
      },
      {
        role: 'user',
        content: `Find 8 real agencies that help with CS platform implementation or CS AI strategy. Avoid duplicates with: nCloud Integrators, Valuize, CSM Practice, Growth Molecules, Grazitti Interactive, Winning by Design, Satrix Solutions, Clarkston Consulting, RevPartners, CompleteCSM. Look at: CS consultancies, Gainsight partners, ChurnZero partners, HubSpot Service Hub partners, Salesforce Service Cloud implementers. Use real companies.`
      }
    ]
  }
});

requests.push({
  custom_id: 'integrators-batch-2',
  method: 'POST',
  url: '/v1/chat/completions',
  body: {
    model: 'gpt-4.1-mini',
    max_tokens: 2500,
    messages: [
      {
        role: 'system',
        content: `Same format as before. Return JSON array of 7 more real CS agencies:
{"id":"kebab-case","name":"","type":"","location":"","description":"2-3 sentences","specialties":["..."],"website":"https://...","contactUrl":"","featured":false,"featuredUntil":"","featuredBadge":""}
Return ONLY valid JSON array.`
      },
      {
        role: 'user',
        content: `Find 7 MORE real CS/CX agencies. Focus on: EMEA-based consultancies, APAC firms, boutique CS ops specialists, AI transformation agencies. Avoid all previously listed agencies.`
      }
    ]
  }
});

// Write JSONL
const jsonlPath = path.join(BATCH_DIR, 'batch-requests-2.jsonl');
fs.writeFileSync(jsonlPath, requests.map(r => JSON.stringify(r)).join('\n'));

console.log(`✅ Generated ${requests.length} batch requests → ${jsonlPath}`);
console.log(`   - 8 comparison articles (programmatic SEO)`);
console.log(`   - 20 new AI tools (2 batches of 10)`);
console.log(`   - 15 new agencies (2 batches of 8+7)`);
console.log(`   Using gpt-4.1-mini for cost efficiency`);
