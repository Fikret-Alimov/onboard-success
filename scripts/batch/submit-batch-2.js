#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ENV_PATH = '/home/rickcl/.openclaw/workspace/.env.batch';
const BATCH_DIR = __dirname;
const JSONL_PATH = path.join(BATCH_DIR, 'batch-requests-2.jsonl');
const STATE_PATH = path.join(BATCH_DIR, 'batch-state-2.json');

const envContent = fs.readFileSync(ENV_PATH, 'utf-8');
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();

async function main() {
  console.log('📤 Uploading batch file...');
  const formData = new FormData();
  const fileBlob = new Blob([fs.readFileSync(JSONL_PATH)], { type: 'application/jsonl' });
  formData.append('file', fileBlob, 'batch-requests-2.jsonl');
  formData.append('purpose', 'batch');

  const uploadRes = await fetch('https://api.openai.com/v1/files', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
    body: formData,
  });
  const uploadData = await uploadRes.json();
  if (!uploadRes.ok) { console.error('❌', uploadData); process.exit(1); }
  console.log(`✅ File: ${uploadData.id}`);

  console.log('🚀 Creating batch...');
  const batchRes = await fetch('https://api.openai.com/v1/batches', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input_file_id: uploadData.id,
      endpoint: '/v1/chat/completions',
      completion_window: '24h',
      metadata: { project: 'onboard-success', type: 'batch-2-seo-expansion' }
    }),
  });
  const batchData = await batchRes.json();
  if (!batchRes.ok) { console.error('❌', batchData); process.exit(1); }
  
  fs.writeFileSync(STATE_PATH, JSON.stringify({
    batchId: batchData.id, fileId: uploadData.id,
    createdAt: new Date().toISOString(), status: batchData.status,
  }, null, 2));

  console.log(`✅ Batch: ${batchData.id} (${batchData.status})`);
}

main().catch(e => { console.error('❌', e); process.exit(1); });
