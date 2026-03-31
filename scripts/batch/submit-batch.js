#!/usr/bin/env node
/**
 * Submit batch requests to OpenAI Batch API
 * Uploads the JSONL file and creates a batch job
 */

const fs = require('fs');
const path = require('path');

const ENV_PATH = '/home/rickcl/.openclaw/workspace/.env.batch';
const BATCH_DIR = __dirname;
const JSONL_PATH = path.join(BATCH_DIR, 'batch-requests.jsonl');
const STATE_PATH = path.join(BATCH_DIR, 'batch-state.json');

// Load API key
const envContent = fs.readFileSync(ENV_PATH, 'utf-8');
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!OPENAI_API_KEY) { console.error('❌ No OPENAI_API_KEY found'); process.exit(1); }

async function main() {
  console.log('📤 Uploading batch file...');
  
  // Step 1: Upload file
  const formData = new FormData();
  const fileBlob = new Blob([fs.readFileSync(JSONL_PATH)], { type: 'application/jsonl' });
  formData.append('file', fileBlob, 'batch-requests.jsonl');
  formData.append('purpose', 'batch');

  const uploadRes = await fetch('https://api.openai.com/v1/files', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
    body: formData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    console.error('❌ Upload failed:', err);
    process.exit(1);
  }

  const uploadData = await uploadRes.json();
  console.log(`✅ File uploaded: ${uploadData.id}`);

  // Step 2: Create batch
  console.log('🚀 Creating batch job...');
  const batchRes = await fetch('https://api.openai.com/v1/batches', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input_file_id: uploadData.id,
      endpoint: '/v1/chat/completions',
      completion_window: '24h',
      metadata: { project: 'onboard-success', type: 'content-generation' }
    }),
  });

  if (!batchRes.ok) {
    const err = await batchRes.text();
    console.error('❌ Batch creation failed:', err);
    process.exit(1);
  }

  const batchData = await batchRes.json();
  console.log(`✅ Batch created: ${batchData.id}`);
  console.log(`   Status: ${batchData.status}`);
  console.log(`   Requests: ${batchData.request_counts?.total || 'unknown'}`);

  // Save state
  fs.writeFileSync(STATE_PATH, JSON.stringify({
    batchId: batchData.id,
    fileId: uploadData.id,
    createdAt: new Date().toISOString(),
    status: batchData.status,
  }, null, 2));

  console.log(`\n💾 State saved to batch-state.json`);
  console.log(`\nNext: run check-batch.js to poll status, or wait for completion (~1-24h)`);
}

main().catch(e => { console.error('❌ Error:', e); process.exit(1); });
