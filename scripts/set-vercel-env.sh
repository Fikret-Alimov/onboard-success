#!/bin/bash
# Usage: VERCEL_TOKEN=your_token bash scripts/set-vercel-env.sh

if [ -z "$VERCEL_TOKEN" ]; then
  echo "Error: VERCEL_TOKEN environment variable is required"
  exit 1
fi

PROJECT_ID="prj_AghfqNZ8nQ8gKBHfZHkM3i6JWn0S"
TEAM_ID="team_CTHsvbQtm5jbjj20XqebdPHW"

# Set env vars on Vercel
curl -s -X POST "https://api.vercel.com/v10/projects/$PROJECT_ID/env?teamId=$TEAM_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {"key":"NEXT_PUBLIC_SUPABASE_URL","value":"https://jkwcysfobypswfxlglgr.supabase.co","type":"plain","target":["production","preview","development"]},
    {"key":"NEXT_PUBLIC_SUPABASE_ANON_KEY","value":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprd2N5c2ZvYnlwc3dmeGxnbGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MzEwMzIsImV4cCI6MjA5MDUwNzAzMn0.8MBJ4KfYtsFclXmWDrWKX7-p4-lC-B550lvEXABAGCU","type":"plain","target":["production","preview","development"]}
  ]'
echo ""
echo "Done"
