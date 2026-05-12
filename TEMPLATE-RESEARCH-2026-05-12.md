# Template Research — 2026-05-12

## What we already have (7 templates)

1. hubspot-onboarding-tracker
2. intercom-ticket-escalation
3. salesforce-churn-risk-alert
4. salesforce-renewal-pipeline
5. sales-handoff-analyzer
6. wau-wow-comparison
7. weekly-cs-digest

**Gaps in current library:**
- Heavily Salesforce/HubSpot-centric. Nothing for Gainsight/ChurnZero/Vitally users (a big chunk of the addressable market).
- No call/meeting intelligence templates (Gong, Chorus, Fireflies, Grain).
- No expansion-side templates (cross-sell, upsell, advocacy).
- No QBR/Executive Business Review automations despite the playbook existing.
- No NPS/CSAT routing workflows.
- No "claim management" / commercial side templates.
- All templates are n8n. No Zapier, no Make, no native Slack apps — limiting reach.

## Template idea pool — ranked by leverage

Ranking criteria:
- **Pain:** Is this a real, recurring CS workflow CSMs actually do manually?
- **Search demand:** Would someone google this?
- **Buildable:** Can a CSM actually configure it without a developer in <30 min?
- **Differentiation:** Not a generic "send Slack alert" — has actual logic worth downloading.

---

### Tier 1 — Build these next (highest leverage)

**1. AI QBR Prep Agent (Gainsight / Salesforce)**
- *Pain:* CSMs spend 4-8h per QBR prep. Pulls usage data, churn risk, expansion signals, recent tickets, builds talking points.
- *Trigger:* QBR scheduled in calendar within next 7 days
- *Logic:* OpenAI call analyzes inputs → outputs structured QBR deck content (executive summary, wins, risks, asks) → drops into Google Doc or Notion
- *Integrations:* Gainsight or Salesforce + Zendesk + OpenAI + Google Docs
- *Difficulty:* Intermediate, 45 min setup
- *Notes:* You already have a "qbr-prep-agent" mentioned in playbooks but no template file. This is the #1 gap.

**2. Renewal Risk Briefing Generator**
- *Pain:* 30 days before renewal, CSMs scramble to build a risk brief. AI can do it in seconds with usage + sentiment + engagement data.
- *Trigger:* Cron, daily — find contracts renewing in next 30/60/90 days
- *Logic:* Pull last 90 days of usage, last 5 support tickets sentiment, last 3 meetings (Gong), exec sponsor engagement → AI generates 1-page risk brief → email to CSM
- *Integrations:* Salesforce + Gong + Zendesk + OpenAI + Gmail
- *Difficulty:* Intermediate, 40 min
- *Notes:* High intent search keyword. "Renewal risk template" is a real query.

**3. Gong → Salesforce Action Item Sync**
- *Pain:* CSMs join calls, take notes, lose action items. Gong identifies them automatically but doesn't sync back to CRM.
- *Trigger:* Webhook from Gong after call ends
- *Logic:* Extract action items from Gong transcript → create Salesforce Tasks assigned to the CSM with the call context attached
- *Integrations:* Gong + Salesforce
- *Difficulty:* Beginner, 20 min
- *Notes:* Painfully simple, painfully underbuilt. High value to download.

**4. Multi-Threading Tracker (Stakeholder Coverage Alert)**
- *Pain:* Single-threaded accounts churn. CSMs need to know when an account has only 1 active contact in CRM.
- *Trigger:* Weekly, run on all top-tier accounts
- *Logic:* Count active contacts (engaged in last 60 days) per account. If <2, flag. If primary champion left (LinkedIn check), urgent alert.
- *Integrations:* Salesforce + Slack + LinkedIn (or just CRM data)
- *Difficulty:* Intermediate, 30 min
- *Notes:* "Champion change detection" is a known retention play. No good templated version exists.

**5. AI Customer Health Score Builder (No-Platform Version)**
- *Pain:* Mid-market SaaS without Gainsight/ChurnZero — they want health scores but can't justify $50k+/yr.
- *Trigger:* Daily cron
- *Logic:* Pull usage from Mixpanel/Amplitude + ticket count from Zendesk + NPS score → weighted score in Google Sheets → if drops >15 points, Slack alert
- *Integrations:* Mixpanel + Zendesk + Google Sheets + Slack
- *Difficulty:* Intermediate, 45 min
- *Notes:* This template is the "Gainsight for free" play. Huge addressable audience.

---

### Tier 2 — Solid follow-ups

**6. Onboarding Stalled-Account Reviver**
- Detect accounts that hit a milestone but haven't progressed in 14 days → auto-trigger CSM nudge + email sequence
- *Stack:* HubSpot + OpenAI + Gmail
- *Setup:* 30 min

**7. Expansion Signal Detector** (you have a reference to this but no template file)
- Watch for usage spikes, new-seat triggers, feature adoption thresholds → flag to CSM with $ estimate
- *Stack:* Mixpanel + Salesforce + Slack
- *Setup:* 35 min

**8. NPS Detractor Auto-Routing**
- New NPS response <7 → enrich account context → route to Head of CS, draft apology+next-steps email
- *Stack:* Delighted/AskNicely/SurveyMonkey + OpenAI + Slack
- *Setup:* 25 min

**9. AI Meeting Recap → Notion CSM Notebook**
- Fireflies/Otter transcript → AI summarizes → appends to per-account Notion page so the next CSM has full context
- *Stack:* Fireflies + OpenAI + Notion
- *Setup:* 20 min

**10. Support Ticket Sentiment Trending**
- Weekly sentiment analysis of all support tickets per account → flag accounts trending negative
- *Stack:* Zendesk + OpenAI + Google Sheets + Slack
- *Setup:* 30 min

---

### Tier 3 — Niche but useful

**11. SaaS Contract Auto-Summarizer** — paste a contract PDF, get key terms (renewal date, auto-renew language, NRR commitments). Stack: Google Drive + OpenAI + Notion.

**12. Customer Advisory Board (CAB) Outreach Builder** — identifies top advocates from NPS + usage, drafts personalized invites. Stack: NPS tool + CRM + OpenAI + Gmail.

**13. Quarterly NRR/GRR Calculator (no Gainsight)** — pulls Stripe + CRM data, computes NRR, GRR, logo churn, dollar churn into a Google Sheets dashboard. Stack: Stripe + Salesforce + Google Sheets.

**14. Win/Loss Reason Extractor** — every churned account's last Gong call + ticket history → AI extracts "real reason" → appends to a churn reasons sheet. Stack: Gong + Zendesk + Salesforce + OpenAI.

**15. Slack-Connect Channel Health Monitor** — for vendors using Slack Connect with customers, monitor channel activity (msgs/week, response time, sentiment) → flag dying channels. Stack: Slack API + OpenAI.

---

## Recommendation: build 3 today

**The 3 highest-leverage templates to ship today, in order:**

1. **AI QBR Prep Agent** — closes the gap with your existing playbook references, very searchable query, very high CSM pain.
2. **Renewal Risk Briefing Generator** — direct revenue-impact template, "renewal risk" is a high-intent search.
3. **AI Customer Health Score Builder (No-Platform Version)** — opens up the audience beyond Gainsight/ChurnZero shops to all mid-market SaaS.

Each is 2-3 files (meta.json + README.md + workflow.json placeholder). The workflow.json doesn't need to be perfect — can be a documented stub that says "import this into n8n and configure these nodes."

**My call:** Ship metadata + READMEs for all 3 today. Workflow JSON can be filled in as we go, or shipped as "Pro tier — request access" to gate it and capture leads.
