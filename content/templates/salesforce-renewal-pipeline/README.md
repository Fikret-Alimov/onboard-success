# Salesforce Renewal Pipeline Digest

Every Monday at 8 AM, this workflow pulls all renewal opportunities closing within 90 days from Salesforce, enriches them with account health signals, and posts a structured digest to your Slack renewals channel — grouped into Critical, Watch, and Healthy buckets.

---

## Prerequisites

- n8n instance (self-hosted or n8n Cloud)
- Salesforce account with API access
- Renewal opportunities using specific `StageName` values in Salesforce
- Slack workspace with bot token
- n8n Salesforce credential (OAuth2) — [setup guide](https://docs.n8n.io/integrations/builtin/credentials/salesforce/)
- n8n Slack credential — [setup guide](https://docs.n8n.io/integrations/builtin/credentials/slack/)

---

## Setup Steps

### 1. Import the workflow
In n8n, go to **Workflows → Import from File** and select `workflow.json`.

### 2. Configure Salesforce credentials
- Open the **"Query Renewal Opportunities"** node
- Create or select your Salesforce OAuth2 credential
- Required Salesforce permissions: `Read` on `Opportunity`, `Account`, `Case`

### 3. Verify your Salesforce stage names
Open the **"Query Renewal Opportunities"** node and check the `StageName IN (...)` list:
```sql
StageName IN ('Renewal Due', 'Renewal Negotiation', 'Renewal At Risk')
```
Go to Salesforce → Setup → Object Manager → Opportunity → Fields → `StageName` → view your picklist values. Replace the stage names in the query to exactly match yours (case-sensitive).

### 4. Add custom health score field (optional)
If your Salesforce org has a custom Account health score field (e.g., `Health_Score__c`), add it to the SOQL:
```sql
SELECT ..., Account.Health_Score__c FROM Opportunity WHERE ...
```
Then reference it in the **"Enrich With Risk Signals"** Code node to factor it into urgency classification.

### 5. Configure Slack
- In the **"Post Digest to Slack"** node, change `#cs-renewals` to your channel name
- Create or select your Slack credential (bot token starting with `xoxb-`)
- Invite the bot to your channel: `/invite @your-bot-name`

### 6. Activate the workflow
Toggle to **Active**. It runs every Monday at 8:00 AM server time.

---

## Urgency Classification Logic

| Urgency | Triggers |
|---|---|
| 🔴 Critical | Closing ≤ 30 days OR Stage = "Renewal At Risk" |
| 🟡 Watch | Closing 31–60 days OR No CSM activity >30 days OR 3+ open cases |
| 🟢 Healthy | Closing 61–90 days, no risk signals |

---

## Sample Slack Output

```
📊 *Weekly Renewal Pipeline — Monday, April 14*
8 renewals closing within 90 days

🔴 *CRITICAL (2)*
• *Acme Corp* — $45,000 — closes 2026-04-28 (14d)
  _Closing in 14 days · Stage: Renewal At Risk_
  CSM: Jane Smith | View in Salesforce

🟡 *WATCH (3)*
• *TechCo Ltd* — $28,000 — closes 2026-05-20 (36d)
  _No CSM activity in 42 days_
  CSM: Bob Jones | View in Salesforce

🟢 *HEALTHY (3)*
• *StartupXYZ* — $12,000 — closes 2026-06-10
```

---

## Troubleshooting

**SOQL query returns zero results**
- Your renewal stage names don't match. Run this in Salesforce Developer Console to check: `SELECT StageName, COUNT(Id) FROM Opportunity GROUP BY StageName`
- Ensure `CloseDate <= NEXT_N_DAYS:90` is working — SOQL date literals are UTC

**`Account.Owner.Name` shows "Unknown CSM"**
- This is a relationship field. Confirm your Salesforce user has permission to read the `User` object
- Alternatively, add a custom `CSM_Name__c` field to Account and use that instead

**Digest is too long for Slack**
- Slack messages have a 3,000 character limit for regular text
- If you have many renewals, consider splitting Critical/Watch/Healthy into separate messages by adding 3 Slack nodes after the digest node
