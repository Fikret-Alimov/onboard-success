#!/usr/bin/env node
/**
 * Check batch 2 and process results:
 * - Comparison articles → /content/posts/
 * - New agents → merge into /content/agents.json
 * - New integrators → merge into /content/integrators.json
 */

const fs = require('fs');
const path = require('path');

const ENV_PATH = '/home/rickcl/.openclaw/workspace/.env.batch';
const BATCH_DIR = __dirname;
const STATE_PATH = path.join(BATCH_DIR, 'batch-state-2.json');
const CONTENT_DIR = path.join(__dirname, '../../content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');

const envContent = fs.readFileSync(ENV_PATH, 'utf-8');
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!OPENAI_API_KEY) { console.error('❌ No key'); process.exit(1); }
if (!fs.existsSync(STATE_PATH)) { console.error('❌ No state file'); process.exit(1); }
const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));

const compSlugs = {
  'comp-1': 'churnzero-vs-gainsight',
  'comp-2': 'gainsight-vs-vitally',
  'comp-3': 'churnzero-vs-vitally',
  'comp-4': 'gainsight-vs-oliv-ai',
  'comp-5': 'totango-vs-gainsight',
  'comp-6': 'churnzero-vs-oliv-ai',
  'comp-7': 'best-cs-platforms-2026',
  'comp-8': 'best-cs-ai-agents-2026',
};

async function main() {
  console.log(`🔍 Checking batch ${state.batchId}...`);
  const res = await fetch(`https://api.openai.com/v1/batches/${state.batchId}`, {
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
  });
  const batch = await res.json();
  console.log(`   Status: ${batch.status}`);
  console.log(`   Completed: ${batch.request_counts?.completed || 0}/${batch.request_counts?.total || '?'}`);
  console.log(`   Failed: ${batch.request_counts?.failed || 0}`);

  state.status = batch.status;
  state.lastChecked = new Date().toISOString();
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));

  if (batch.status !== 'completed') {
    if (batch.status === 'failed') console.error('❌ Failed!', batch.errors);
    else console.log('⏳ Not ready yet.');
    return;
  }

  console.log('\n📥 Downloading results...');
  const fileRes = await fetch(`https://api.openai.com/v1/files/${batch.output_file_id}/content`, {
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
  });
  const resultsText = await fileRes.text();
  fs.writeFileSync(path.join(BATCH_DIR, 'batch-results-2.jsonl'), resultsText);

  const lines = resultsText.trim().split('\n').map(l => JSON.parse(l));
  let success = 0, fail = 0;

  // Collect new agents and integrators
  let newAgents = [];
  let newIntegrators = [];

  for (const result of lines) {
    const id = result.custom_id;
    const content = result.response?.body?.choices?.[0]?.message?.content;
    if (!content) { console.error(`❌ No content for ${id}`); fail++; continue; }

    if (compSlugs[id]) {
      // Comparison article
      fs.writeFileSync(path.join(POSTS_DIR, `${compSlugs[id]}.mdx`), content);
      console.log(`📝 Comparison: ${compSlugs[id]}.mdx`);
      success++;
    } else if (id.startsWith('agents-batch')) {
      let json = content.replace(/^```json?\n?/gm, '').replace(/```$/gm, '').trim();
      try {
        const parsed = JSON.parse(json);
        newAgents = newAgents.concat(parsed);
        console.log(`🤖 Agents batch: ${parsed.length} tools`);
        success++;
      } catch (e) {
        console.error(`❌ Agent parse error: ${e.message}`);
        fs.writeFileSync(path.join(BATCH_DIR, `${id}-raw.txt`), content);
        fail++;
      }
    } else if (id.startsWith('integrators-batch')) {
      let json = content.replace(/^```json?\n?/gm, '').replace(/```$/gm, '').trim();
      try {
        const parsed = JSON.parse(json);
        newIntegrators = newIntegrators.concat(parsed);
        console.log(`🏢 Integrators batch: ${parsed.length} agencies`);
        success++;
      } catch (e) {
        console.error(`❌ Integrator parse error: ${e.message}`);
        fs.writeFileSync(path.join(BATCH_DIR, `${id}-raw.txt`), content);
        fail++;
      }
    }
  }

  // Merge agents
  if (newAgents.length > 0) {
    const existing = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'agents.json'), 'utf-8'));
    const existingIds = new Set(existing.map(a => a.id));
    const unique = newAgents.filter(a => !existingIds.has(a.id));
    const merged = [...existing, ...unique];
    fs.writeFileSync(path.join(CONTENT_DIR, 'agents.json'), JSON.stringify(merged, null, 2));
    console.log(`\n🤖 Agents: ${existing.length} → ${merged.length} (+${unique.length} new)`);
  }

  // Merge integrators
  if (newIntegrators.length > 0) {
    const existing = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'integrators.json'), 'utf-8'));
    const existingIds = new Set(existing.map(i => i.id));
    const unique = newIntegrators.filter(i => !existingIds.has(i.id));
    const merged = [...existing, ...unique];
    fs.writeFileSync(path.join(CONTENT_DIR, 'integrators.json'), JSON.stringify(merged, null, 2));
    console.log(`🏢 Integrators: ${existing.length} → ${merged.length} (+${unique.length} new)`);
  }

  console.log(`\n✅ Done: ${success} succeeded, ${fail} failed`);
}

main().catch(e => { console.error('❌', e); process.exit(1); });
