# Weekly CS Team Digest

Every Monday at 8 AM, runs four parallel Salesforce queries — new churns, renewals closing this week, high-priority open cases, and accounts with no activity in 21+ days — then posts a single structured Block Kit message to your Slack CS channel.

---

## Prerequisites

- n8n instance (self-hosted or n8n Cloud)
- Salesforce account with API access
- Slack workspace with bot token
- n8n Salesforce credential (OAuth2) — [setup guide](https://docs.n8n.io/integrations/builtin/credentials/salesforce/)
- n8n Slack credential — [setup guide](https://docs.n8n.io/integrations/builtin/credentials/slack/)

---

## Setup Steps

### 1. Import the workflow
In n8n, go to **Workflows → Import from File** and select `workflow.json`.

### 2. Configure Salesforce credentials
All four Salesforce nodes use the same credential. Configure one, then apply it to all:
- **"Query New Churns"** — reads Opportunities (StageName = 'Closed Lost')
- **"Query Upcoming Renewals"** — reads Opportunities with renewal stages
- **"Query Escalated Cases"** — reads Cases with Priority = 'High'
- **"Query Stale Accounts"** — reads Accounts with LastActivityDate

Required Salesforce permissions: `Read` on Opportunity, Case, Account objects.

### 3. Verify your Salesforce stage names
The workflow queries `StageName = 'Closed Lost'` for churns and `StageName IN ('Renewal Due', 'Renewal Negotiation', 'Renewal At Risk')` for renewals.

Check your actual stage names: Salesforce → Setup → Object Manager → Opportunity → Fields → StageName → Picklist Values. Update both nodes to match exactly (case-sensitive).

### 4. Configure Slack
- In the **"Post Weekly Digest"** node, change `#cs-team` to your channel
- Configure your Slack credential (bot token `xoxb-...`)
- Invite the bot to the channel: `/invite @your-bot-name`

### 5. Add custom health score field (optional)
If your Salesforce org has a custom health score on Account (e.g., `Health_Score__c`):

In the **"Query Stale Accounts"** node, add it to the SOQL:
```sql
SELECT Id, Name, Owner.Name, LastActivityDate, Health_Score__c FROM Account ...
```

Then in the **"Compile Digest"** Code node, add a health score line to the stale accounts section:
```javascript
return `• ${a.Name} — score: ${a.Health_Score__c} — last activity: ${days}d ago`;
```

### 6. Adjust inactivity threshold
The stale accounts query uses `LAST_N_DAYS:21`. To change this:
- In the **"Query Stale Accounts"** node, change `21` to your preferred number of days
- The `LIMIT 10` cap prevents the digest from getting too long — increase if needed

### 7. Activate the workflow
Toggle to **Active**. It will run every Monday at 8:00 AM server time.

---

## Sample Slack Output

```
📊 CS Weekly Digest — Monday, April 14

💔 New Churns This Week (1)
• Acme Corp — $24,000 (CSM: Jane Smith)

──────────────────────────────

🔄 Renewals Closing This Week (2)
• TechCo Ltd — $45,000 — 2026-04-16 (Renewal Due)
• StartupXYZ — $12,000 — 2026-04-18 (Renewal Negotiation)

──────────────────────────────

🚨 High-Priority Open Cases (1)
• BigCorp: API outage — critical (Open)

──────────────────────────────

⚠️ Accounts With No Activity (21+ days, top 3)
• OldCustomer Inc — last activity: 45d ago (CSM: Bob Jones)
• InactiveCo — last activity: 38d ago (CSM: Sara Lee)
• DormantLtd — last activity: 29d ago (CSM: Mike Chen)
```

---

## Troubleshooting

**Slack message shows raw blocks JSON instead of formatted message**
- n8n's Slack node Block Kit rendering requires the blocks to be passed correctly
- In the Slack node, make sure `blocksUi` is set and the text field has fallback content
- Test by sending to a DM first before posting to the team channel

**Merge node combining results incorrectly**
- The Merge node in `multiplex` mode outputs all combinations of inputs
- If items are getting duplicated, switch to `mode: append` in the Merge node parameters and update the Code node filtering logic

**SOQL query errors**
- Run queries first in Salesforce's Workbench (workbench.developerforce.com) to verify syntax
- Date literals like `LAST_N_DAYS:7` and `NEXT_N_DAYS:7` are UTC-based

**"Query Escalated Cases" returns too many results**
- Add `LIMIT 5` to the SOQL to cap it, or change `Priority = 'High'` to `Priority = 'High' AND IsEscalated = true` if you use Salesforce's escalation feature
