# Renewal Risk Briefing Generator

Every weekday morning at 6 AM, AI-generated renewal risk briefings land in your CSMs' inboxes — one for each account renewing in the next 30, 60, or 90 days. By the time the CSM gets their coffee, they know exactly which renewals are at risk, why, and what to do about it.

---

## What this replaces

Most CS teams "review the renewal pipeline" once a quarter — too late. By the time a renewal is flagged manually, the customer has already mentally decided. This automation runs the analysis every day, so risk surfaces 30-60-90 days before the renewal date, not 7.

---

## Prerequisites

- n8n instance (self-hosted or n8n Cloud)
- Salesforce with API access (or HubSpot, Pipedrive)
- Gong account with API access (or Chorus/Fireflies)
- Zendesk account with API access
- Mixpanel project with Service Account credentials (or Amplitude)
- OpenAI API key with GPT-4 access
- Gmail OAuth2 for CSM email delivery

---

## Setup Steps

### 1. Import the workflow
Workflows → Import from File → select `workflow.json`.

### 2. Configure credentials

| Service | Type | Notes |
|---|---|---|
| Salesforce | OAuth2 | Read scope on `Account`, `Opportunity`, `Contract` |
| Gong | HTTP Header Auth | `Basic <base64(ACCESS_KEY:SECRET)>` |
| Zendesk | API token | Admin → API → token; needs `read` on tickets |
| Mixpanel | HTTP Header Auth | Service Account credentials |
| OpenAI | API key | GPT-4 access required |
| Gmail | OAuth2 | Sender must be an authorized domain user |

### 3. Set your renewal detection logic
- Open the **"Find Upcoming Renewals"** node (Salesforce)
- Default SOQL: queries `Opportunity` with `Type = 'Renewal'` and `CloseDate` between today and 90 days out
- If you track renewals on the `Account` object instead: change the query to use `Contract` or your custom field

### 4. Tune the risk signal weights
- Open the **"Calculate Risk Score"** Code node
- Default weights:
  - Usage trend (declining >30% MoM): **35%**
  - Support tickets (escalations + sentiment): **25%**
  - Exec sponsor engagement (last call/email date): **20%**
  - Gong call sentiment (last 3 calls): **20%**
- Adjust based on what predicts churn in your business

### 5. Configure email delivery
- Open the **"Email Brief to CSM"** node
- Default: sends to the Salesforce Opportunity `Owner.Email`
- Subject template: `🚨 Renewal Risk: [Account] — [Days] days out — [Risk Level]`

### 6. Set the cron schedule
- Default: **6:00 AM weekdays** (`0 6 * * 1-5`)
- Change in the **Daily Trigger** node if your CSMs start earlier or later

### 7. Activate the workflow
- Toggle to **Active**
- First run: it'll generate briefings for every in-flight renewal (could be many — consider running off-hours the first time)

---

## What each briefing contains

```
🚨 RENEWAL RISK BRIEFING
Account: Acme Corp
Renewal Date: 2026-07-15 (62 days out)
Risk Level: HIGH (78/100)
ARR at risk: $145,000

TOP 3 RISK SIGNALS
1. Usage down 42% MoM (Mixpanel — 'workflow_run' events)
2. 4 escalated tickets in last 30 days, sentiment trending negative
3. Champion (Sarah Chen) has not joined a call in 47 days

RECOMMENDED SAVE PLAY
Multi-thread: their VP Ops (Mark Johnson) was the original buyer.
Re-engage him with the Q3 product roadmap, frame as "ahead of renewal".

DRAFT EMAIL TO CHAMPION
Subject: Quick sync before your Q3 planning?
Hi Sarah, I noticed usage on [feature] has dipped recently...
[full draft, ready to copy-paste]

DATA SUMMARY
- Last QBR: 2026-02-15 (87 days ago)
- Open opps: $50k expansion (stalled in negotiation)
- NPS last response: 6 (detractor)
```

---

## Risk score breakdown

| Signal | Default Weight | What we measure |
|---|---|---|
| Usage trend (MoM) | 35% | Decline >30% = high signal |
| Support sentiment | 25% | Escalation count + GPT sentiment |
| Exec sponsor engagement | 20% | Days since champion touched product/email |
| Call sentiment | 20% | Avg sentiment last 3 Gong calls |

Total = 100. Risk levels:
- **0-39:** LOW (briefing skipped to keep noise down)
- **40-64:** MEDIUM
- **65-100:** HIGH (always briefed, also Slack-alerted)

---

## Alternate CRMs

- **HubSpot**: Use Deals with stage filter or `closedate` between now and 90 days.
- **Pipedrive**: Filter Deals by `expected_close_date`.

## Cost estimate

Per briefing:
- GPT-4 tokens (~4k in + 1.5k out): **$0.15-$0.25**

For a team with 50 renewals in flight: **~$10-12/day** of OpenAI cost. Vs. catching one $50k churn save = 5,000x ROI.

---

## Troubleshooting

**"No renewals found"** — your CRM probably doesn't tag renewals as `Type = 'Renewal'`. Check your `Opportunity.Type` picklist values and update the SOQL.

**"GPT generic output"** — add product/industry context to the system prompt in the **Generate Briefing** node.

**"Email not sending"** — Gmail rate limits at 500/day on consumer accounts, 2000/day on Workspace. For high-volume teams, switch to a transactional sender like Resend or SendGrid.

**"Same briefing every day"** — by design, briefings re-generate daily because signals change. To dedupe, add an IF node checking the **risk score delta** vs. yesterday's run.

---

## Roadmap

- v1.1 — Slack alert in addition to email when risk score crosses 75
- v1.2 — Auto-create a "Save Play" task in Salesforce on HIGH risk
- v2.0 — Auto-multi-thread: when champion disengages, surface 2nd/3rd contacts

---

Built by [OnboardSuccess](https://www.onboard-success.com) — AI for Customer Success, without the vendor spin.
