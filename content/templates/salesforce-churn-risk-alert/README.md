# Salesforce Churn Risk Alert

Automatically scans your Salesforce customer accounts every weekday morning at 8 AM, calculates a churn risk score (0–100) based on inactivity, open cases, and missing opportunities, and posts formatted alerts to Slack for high-risk accounts.

---

## Prerequisites

- n8n instance (self-hosted or n8n Cloud)
- Salesforce account with API access enabled
- Slack workspace with a bot OAuth token
- n8n Salesforce credential (OAuth2) — [setup guide](https://docs.n8n.io/integrations/builtin/credentials/salesforce/)
- n8n Slack credential (OAuth2) — [setup guide](https://docs.n8n.io/integrations/builtin/credentials/slack/)

---

## Setup Steps

### 1. Import the workflow
In n8n, go to **Workflows → Import from File** and select `workflow.json`.

### 2. Configure Salesforce credentials
- Open the **"Query Salesforce Accounts"** node
- Click the Credentials dropdown → **Create New**
- Follow the Salesforce OAuth2 setup (you need a Connected App in Salesforce with `api` and `refresh_token` scopes)
- Required Salesforce permissions: `Read` access on `Account`, `Case`, and `Opportunity` objects

### 3. Configure Slack credentials
- Open the **"Post Risk Alert to Slack"** node
- Click the Credentials dropdown → **Create New**
- Add your Slack Bot Token (starts with `xoxb-`)
- Required Slack scopes: `chat:write`, `chat:write.public`

### 4. Set your Slack channel
- In the **"Post Risk Alert to Slack"** node, change `#cs-alerts` to your target channel
- Make sure the Slack bot is invited to that channel (`/invite @your-bot-name`)

### 5. Tune the risk threshold (optional)
- Open the **"Risk Score Above 60?"** IF node
- Change the value `60` to your preferred threshold
- Recommended ranges: 60 = high attention, 75 = critical only

### 6. Adjust the SOQL query (optional)
- Open the **"Query Salesforce Accounts"** node
- Default inactivity window is `LAST_N_DAYS:30` — change to `LAST_N_DAYS:14` for tighter monitoring
- If your accounts use a custom field for customer type, replace `Type = 'Customer'` with your condition

### 7. Activate the workflow
- Toggle the workflow to **Active**
- It will run Monday–Friday at 8:00 AM server time

---

## Risk Score Breakdown

| Signal | Weight | Max Points |
|---|---|---|
| Days since last Salesforce activity | 40% | 40 pts |
| Open cases created in last 30 days | 30% | 30 pts |
| No open renewal/expansion opportunity | 15% | 15 pts |
| No logged activity in 14 days | 15% | 15 pts |

**Score interpretation:**
- 75–100: 🔴 Critical — escalate immediately
- 60–74: 🟠 High — review same day
- 40–59: 🟡 Medium — monitor closely
- 0–39: 🟢 Low — healthy

---

## Slack Message Format

```
🚨 *Churn Risk Alert: Acme Corp*

Risk Score: *78/100* — 🔴 Critical

*Top Risk Factors:*
• No activity in 47 days
• 4 open case(s) in last 30 days
• No open renewal or expansion opportunity

*CSM:* Jane Smith
*Salesforce:* https://login.salesforce.com/001...
```

---

## Troubleshooting

**"No accounts returned" from Salesforce**
- Check that `Type = 'Customer'` matches your Account Type picklist exactly — it's case-sensitive in SOQL
- Verify your Salesforce user has read access to the Account, Case, and Opportunity objects

**Slack message not sending**
- Confirm the bot is invited to the channel: `/invite @your-bot-name`
- Check that your Slack credential has `chat:write` scope

**Wrong owner name showing**
- The workflow reads `Owner.Name` via a relationship query. If your Salesforce org uses a custom field for the CSM, change `Owner.Name` in the SOQL and update the `ownerName` reference in the Code node to `account.CSM_Name__c` (or your field API name)

**All accounts showing score 0**
- Check that Salesforce is returning `LastActivityDate` — if all accounts show null, activity logging may be disabled in your org (Settings → Activity Settings → Enable Activity Feed)
