# AI QBR Prep Agent

Auto-generate Quarterly Business Review briefs in under a minute. The agent scans your CRM for upcoming QBRs, pulls usage + support + call data for each account, and uses GPT-4 to write a structured QBR brief directly into a Google Doc. Cuts 4-6 hours of manual prep down to seconds.

---

## What this replaces

CSMs typically spend 4-8 hours per QBR pulling data from 4-5 systems, screenshotting dashboards, and writing talking points by hand. By the time they're done, the data is already stale. This agent runs every Monday morning and produces a fresh brief for every QBR scheduled in the next 7 days.

---

## Prerequisites

- n8n instance (self-hosted or n8n Cloud)
- Salesforce with API access (or HubSpot — see "Alternate CRMs" below)
- Gong account with API access (or Chorus/Fireflies — see "Alternate Call Tools")
- Zendesk account with API access
- Mixpanel project with Service Account key (or Amplitude)
- OpenAI API key with GPT-4 access
- Google account with Docs API enabled

---

## Setup Steps

### 1. Import the workflow
In n8n, go to **Workflows → Import from File** and select `workflow.json`.

### 2. Configure credentials (in order)

**Salesforce (OAuth2)**
- Credentials → New → Salesforce OAuth2
- Connected App with `api` + `refresh_token` scopes
- Required read access: `Account`, `Opportunity`, `Event` (for QBR calendar entries)

**Gong API**
- Credentials → New → HTTP Header Auth
- Header name: `Authorization`
- Value: `Basic <base64-encoded GONG_ACCESS_KEY:GONG_SECRET>`
- Or use the official Gong API key from Settings → Company → API

**Zendesk API**
- Credentials → New → Zendesk API
- Subdomain, email, API token (from Zendesk → Admin Center → Apps & integrations → Zendesk API)

**Mixpanel Service Account**
- Credentials → New → HTTP Header Auth
- Header: `Authorization: Basic <base64(SERVICE_ACCOUNT_USER:SECRET)>`

**OpenAI**
- Credentials → New → OpenAI
- API key from platform.openai.com → API Keys

**Google Docs**
- Credentials → New → Google Docs OAuth2
- Required scope: `https://www.googleapis.com/auth/documents`

### 3. Configure the QBR detection query
- Open the **"Find Upcoming QBRs"** node (Salesforce)
- Default SOQL filter: `Subject LIKE '%QBR%' AND ActivityDate >= TODAY AND ActivityDate <= NEXT_N_DAYS:7`
- Change if your QBRs use different naming (e.g., `EBR`, `Quarterly Review`)

### 4. Set the Google Doc template
- Open the **"Create QBR Doc"** node
- Set parent folder ID (the Google Drive folder where briefs should land)
- Optional: pre-create a template doc and set its ID in `templateId`

### 5. Tune the GPT-4 prompt (optional)
- Open the **"Generate QBR Brief"** node
- The system prompt is in the **System Message** field
- Customize sections, tone, length to match your CS playbook

### 6. Activate the workflow
- Toggle to **Active**
- Runs every Monday at 7:00 AM server time
- Briefs land in Google Drive folder, named: `QBR Brief - [Account] - [Date]`

---

## What the AI produces

For each account, the brief includes:

| Section | Source data | What GPT-4 does |
|---|---|---|
| **Executive Summary** | All sources | 2-3 sentences on overall account health and trajectory |
| **Wins to celebrate** | Mixpanel + Salesforce | Top 3 adoption/expansion wins last quarter |
| **Risks to address** | Zendesk + Gong + usage drop | Top 3 risk signals with severity |
| **Expansion signals** | Mixpanel + Salesforce ops | Detected opportunities with $ estimate |
| **Recent conversations** | Gong | Summary of last 3 calls + open action items |
| **Recommended agenda** | All sources | 5-point QBR agenda prioritized by importance |
| **Talking points** | All sources | 5-7 ready-to-say lines for the CSM |

---

## Alternate CRMs

- **HubSpot**: Replace the Salesforce node with HubSpot CRM. Use the Engagements endpoint and filter on `type = MEETING` with `hs_meeting_title LIKE '%QBR%'`.
- **Pipedrive**: Use the Activities endpoint, filter by type and date.

## Alternate Call Tools

- **Chorus**: Replace Gong node with Chorus API (use the `/v1/calls` endpoint, filter by account_id and last 90 days).
- **Fireflies**: Use the Fireflies GraphQL API (`transcripts` query, filter by participants).
- **Otter.ai**: Use the Otter API (`/calls` endpoint).

## Cost estimate

Per QBR brief:
- OpenAI GPT-4 input + output (~6k tokens): **$0.20-$0.40**
- All other API calls: free under standard plan limits

For a team running 20 QBRs/quarter, total OpenAI cost = **~$8-16/quarter**. Compare to 80-120 CSM hours saved.

---

## Troubleshooting

**"No upcoming QBRs found"** — check your Salesforce filter. Some teams use `Type = 'Customer Meeting'` instead of `Subject LIKE '%QBR%'`.

**"Gong API returns empty calls"** — verify the account email is the same in Gong as in Salesforce. Gong matches by participant email.

**"GPT-4 output is generic"** — the system prompt needs more business context. Add your industry, ICP, and product description to the `System Message` field.

**"Docs created but blank"** — check Google Docs API quota (free tier is 60 writes/min, easy to hit during peak runs).

---

## Roadmap

- v1.1 — Add Slack notification with brief link when each QBR doc is ready
- v1.2 — Auto-attach the brief to the Salesforce QBR event so the CSM sees it in their calendar
- v2.0 — Slack-Connect channel sentiment integration

---

Built by [OnboardSuccess](https://www.onboard-success.com) — AI for Customer Success, without the vendor spin.
