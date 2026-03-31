#!/usr/bin/env node
/**
 * Check batch status and download results when complete
 * Processes results into content files for the site
 */

const fs = require('fs');
const path = require('path');

const ENV_PATH = '/home/rickcl/.openclaw/workspace/.env.batch';
const BATCH_DIR = __dirname;
const STATE_PATH = path.join(BATCH_DIR, 'batch-state.json');
const CONTENT_DIR = path.join(__dirname, '../../content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');

// Load API key
const envContent = fs.readFileSync(ENV_PATH, 'utf-8');
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!OPENAI_API_KEY) { console.error('❌ No OPENAI_API_KEY found'); process.exit(1); }

// Load state
if (!fs.existsSync(STATE_PATH)) { console.error('❌ No batch-state.json. Run submit-batch.js first.'); process.exit(1); }
const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));

const articleSlugs = {
  'article-1': 'from-insight-to-action',
  'article-2': 'long-tail-problem',
  'article-3': 'ai-health-scores-2026',
  'article-4': 'qbr-by-agent',
  'article-5': 'cs-ai-stack-2026',
  'article-6': 'autonomous-onboarding',
  'article-7': 'churn-signals-2026',
  'article-8': 'cs-roi-ai-2026',
  'article-9': 'agents-vs-copilots',
  'article-10': 'building-custom-cs-agents',
};

async function main() {
  // Check status
  console.log(`🔍 Checking batch ${state.batchId}...`);
  
  const statusRes = await fetch(`https://api.openai.com/v1/batches/${state.batchId}`, {
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
  });

  const batch = await statusRes.json();
  console.log(`   Status: ${batch.status}`);
  console.log(`   Completed: ${batch.request_counts?.completed || 0}/${batch.request_counts?.total || '?'}`);
  console.log(`   Failed: ${batch.request_counts?.failed || 0}`);

  // Update state
  state.status = batch.status;
  state.lastChecked = new Date().toISOString();
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));

  if (batch.status !== 'completed') {
    if (batch.status === 'failed') {
      console.error('❌ Batch failed!');
      if (batch.errors) console.error(JSON.stringify(batch.errors, null, 2));
    } else {
      console.log(`\n⏳ Not ready yet. Run again later.`);
    }
    return;
  }

  // Download results
  console.log('\n📥 Downloading results...');
  const outputFileId = batch.output_file_id;
  if (!outputFileId) { console.error('❌ No output file'); return; }

  const fileRes = await fetch(`https://api.openai.com/v1/files/${outputFileId}/content`, {
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
  });
  const resultsText = await fileRes.text();
  
  // Save raw results
  fs.writeFileSync(path.join(BATCH_DIR, 'batch-results.jsonl'), resultsText);
  console.log('💾 Raw results saved to batch-results.jsonl');

  // Parse and distribute results
  const lines = resultsText.trim().split('\n').map(l => JSON.parse(l));
  
  // Ensure directories exist
  fs.mkdirSync(POSTS_DIR, { recursive: true });

  let successCount = 0;
  let failCount = 0;

  for (const result of lines) {
    const id = result.custom_id;
    const content = result.response?.body?.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error(`❌ No content for ${id}`);
      failCount++;
      continue;
    }

    if (articleSlugs[id]) {
      // Playbook article → MDX file
      const slug = articleSlugs[id];
      const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
      fs.writeFileSync(filePath, content);
      console.log(`📝 Article: ${slug}.mdx`);
      successCount++;
    } else if (id === 'agents-json') {
      // Clean JSON (remove markdown fences if present)
      let json = content.replace(/^```json?\n?/gm, '').replace(/```$/gm, '').trim();
      try {
        // Validate JSON
        const parsed = JSON.parse(json);
        fs.writeFileSync(path.join(CONTENT_DIR, 'agents.json'), JSON.stringify(parsed, null, 2));
        console.log(`🤖 agents.json (${parsed.length} tools)`);
        successCount++;
      } catch (e) {
        console.error(`❌ agents.json parse error: ${e.message}`);
        fs.writeFileSync(path.join(BATCH_DIR, 'agents-raw.txt'), content);
        failCount++;
      }
    } else if (id === 'integrators-json') {
      let json = content.replace(/^```json?\n?/gm, '').replace(/```$/gm, '').trim();
      try {
        const parsed = JSON.parse(json);
        fs.writeFileSync(path.join(CONTENT_DIR, 'integrators.json'), JSON.stringify(parsed, null, 2));
        console.log(`🏢 integrators.json (${parsed.length} agencies)`);
        successCount++;
      } catch (e) {
        console.error(`❌ integrators.json parse error: ${e.message}`);
        fs.writeFileSync(path.join(BATCH_DIR, 'integrators-raw.txt'), content);
        failCount++;
      }
    } else if (id === 'gtm-strategy') {
      fs.writeFileSync(path.join(BATCH_DIR, 'gtm-strategy.md'), content);
      console.log(`📊 GTM strategy → gtm-strategy.md`);
      successCount++;
    }
  }

  console.log(`\n✅ Done: ${successCount} succeeded, ${failCount} failed`);
  console.log(`\nContent files are in: ${CONTENT_DIR}`);
  console.log(`GTM strategy is in: ${BATCH_DIR}/gtm-strategy.md`);
}

main().catch(e => { console.error('❌ Error:', e); process.exit(1); });
