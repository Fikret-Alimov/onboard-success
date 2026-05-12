# Customer Health Score (No CS Platform)

A working customer health score system for mid-market SaaS teams who don't have Gainsight, ChurnZero, or Vitally — and don't want to spend $50k/year to get one. Uses the tools you already have: Mixpanel, Zendesk, Stripe, Google Sheets, Slack.

---

## What this replaces

**The problem:** You're a $5-30M ARR SaaS team. Your CSMs feel blind. You can't justify $50-100k/year for Gainsight or ChurnZero. So you have no health score. Or worse: you have a spreadsheet someone updates by hand once a month.

**This template:** A daily-refreshing weighted health score per account, dropped into a Google Sheet you can chart, sorted by risk. Slack alerts when any account's score drops sharply. Built in n8n. Total cost: ~$0/month beyond the APIs you already pay for.

---

## Prerequisites

- n8n instance (self-hosted or n8n Cloud)
- Mixpanel project with Service Account credentials (or Amplitude — see alternates)
- Zendesk account with API access
- Stripe account with read API key (for MRR data)
- Google Sheets — one spreadsheet, will be created/maintained automatically
- Slack workspace with bot OAuth token
- Optional: NPS tool API (Delighted, AskNicely, SurveyMonkey)

---

## Setup Steps

### 1. Create the Google Sheet
Create a new Google Sheet called `Customer Health Dashboard`. Add these columns to Sheet1:

```
account_id | account_name | mrr | usage_score | support_score | nps_score | retention_score | health_score | health_level | last_updated | score_delta_7d
```

Copy the spreadsheet ID (from the URL) — you'll need it in step 5.

### 2. Import the workflow
Workflows → Import from File → `workflow.json`

### 3. Configure credentials

| Service | Type | Notes |
|---|---|---|
| Mixpanel | HTTP Header Auth | `Authorization: Basic <base64(SERVICE_ACCT:SECRET)>` |
| Zendesk | API token | Subdomain + email + token |
| Stripe | API key | Restricted key with `customers:read` and `subscriptions:read` |
| Google Sheets | OAuth2 | Scope: `spreadsheets` |
| Slack | OAuth2 / Bot Token | `chat:write` + `chat:write.public` |

### 4. Define your account universe
The workflow uses Stripe Customers as the source of truth for "who is a customer." If your data lives elsewhere:
- **CRM-based**: replace the **"Fetch Customers"** Stripe node with a Salesforce/HubSpot query
- **Auth provider-based**: replace with a query against your auth DB

### 5. Set the Google Sheets ID
- Open the **"Append/Update Health Row"** node
- Set `documentId` to your spreadsheet ID from step 1

### 6. Tune the scoring weights
- Open the **"Calculate Health Score"** Code node
- Default weights:
  - **Usage** (30%): daily/weekly active days, key feature adoption
  - **Support** (25%): ticket count + escalation rate (inverse)
  - **NPS** (20%): latest score per account
  - **Retention/MRR** (25%): tenure + MRR growth direction

Adjust the weights based on what predicts churn in your business. If you're early stage, weight usage higher. If you're enterprise-heavy, weight engagement and exec sponsor activity.

### 7. Set the Slack alert threshold
- Open the **"Score Dropped >15 Points?"** IF node
- Default: triggers if `score_delta_7d <= -15`
- Channel: edit the **"Post Health Alert"** node, replace `#cs-alerts` with your channel

### 8. Activate the workflow
- Toggle to **Active**
- Default schedule: daily at **5 AM**
- First run may take 5-15 min for >500 accounts (Mixpanel JQL is slow at scale)

---

## Scoring methodology

Each component is normalized to 0-100, then weighted:

### Usage score (30%)
- 80-100: Active daily, multiple users, multiple features
- 60-79: Active 2-3 days/week, core features
- 40-59: Active weekly, single feature
- 20-39: Active monthly
- 0-19: No activity in last 30 days

### Support score (25%)
- 80-100: 0-1 tickets last 30 days, no escalations
- 60-79: 2-3 tickets, no escalations
- 40-59: 4+ tickets OR 1 escalation
- 20-39: Multiple escalations
- 0-19: Active escalation in last 7 days

### NPS score (20%)
- 80-100: NPS 9-10 (Promoter)
- 60-79: NPS 7-8 (Passive, recent)
- 40-59: No recent NPS response
- 20-39: NPS 5-6 (mild detractor)
- 0-19: NPS 0-4 (Detractor)

### Retention/MRR score (25%)
- 80-100: MRR growing, tenure >1yr
- 60-79: MRR flat, tenure >6mo
- 40-59: MRR flat, new customer
- 20-39: MRR shrinking
- 0-19: MRR cut by half OR contract paused

### Health levels
- **80-100**: 🟢 **Healthy** — promoter/expansion candidate
- **60-79**: 🟡 **Watch** — monitor, possible play
- **40-59**: 🟠 **At Risk** — proactive intervention
- **0-39**: 🔴 **Critical** — escalate to Head of CS

---

## What the Slack alert looks like

```
🚨 Health Score Drop: Acme Corp
Previous: 78 (Watch)  →  Current: 51 (At Risk)
Delta: -27 points in 7 days

Top drivers:
• Usage score: 70 → 35 (key feature adoption dropped)
• Support score: 85 → 60 (3 new tickets, 1 escalation)
• NPS score: unchanged
• MRR/retention: unchanged

CSM: jane@yourcompany.com
View account: [Salesforce link]
View health trend: [Google Sheets link]
```

---

## Alternate analytics tools

**Amplitude instead of Mixpanel**:
- Replace the Mixpanel JQL node with an Amplitude Dashboard REST API call
- `POST https://amplitude.com/api/3/segmentation` with the Charts API
- Same `account_id` event property required

**PostHog instead of Mixpanel**:
- Use the PostHog Query API
- Same event property model

**Heap instead of Mixpanel**:
- Heap doesn't expose JQL-equivalent — you'll need to dump events to your warehouse first

---

## Cost estimate

Per day (full account refresh):
- **Mixpanel JQL**: free under standard plan (1 query/sec rate limit)
- **Zendesk API**: free under standard plan
- **Stripe API**: free
- **Google Sheets API**: free (60 writes/min — large customer bases may need to batch)
- **Slack**: free

**Total cost: $0/month** beyond the APIs you already pay for.

Compare to:
- Gainsight: $50,000-$200,000/year + implementation
- ChurnZero: $35,000-$120,000/year + implementation
- Vitally: $25,000-$80,000/year

---

## Troubleshooting

**"Some accounts return blank usage score"** — make sure every event in Mixpanel includes an `account_id` property. If you're tracking by `distinct_id` (user ID), you'll need to add account context to your tracking calls first.

**"Google Sheets is slow / hitting rate limits"** — switch the **"Append/Update Health Row"** node to batch mode (one Sheets API call per 100 accounts).

**"Health scores all cluster around 50"** — your weights aren't differentiated enough. Try widening the bands: instead of 5 buckets per component, try 3 (good/ok/bad) with bigger point gaps.

**"NPS data is sparse"** — if most customers don't respond to NPS, set the default to a neutral 60 (not 0). Otherwise you'll punish accounts for not responding.

---

## Roadmap

- v1.1 — Add CSM assignment column, alert routes to the assigned CSM directly via Slack DM
- v1.2 — Save daily snapshots to a "history" tab so you can chart trends over time
- v2.0 — Trigger a Slack workflow when score drops to "Critical" for >7 days

---

Built by [OnboardSuccess](https://www.onboard-success.com) — AI for Customer Success, without the vendor spin.
