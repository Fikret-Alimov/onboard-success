# Weekly Active Users: Week-over-Week Alert

## What This Does

Every Monday at 11 AM, this workflow:

1. **Queries Mixpanel** for weekly active users, broken down by account
2. **Compares this week vs. last week** for every account
3. **Logs all results** to a Google Sheet (running history)
4. **Filters for significant changes** — any account with >10% swing (up or down)
5. **Emails your team** a formatted alert showing exactly which accounts moved and by how much
6. **Cleans up** temporary sheet columns after 24 hours

## Flow

```
Monday 11 AM → Calculate Date Range → Fetch WAU from Mixpanel
  → Parse & Compare WoW → Log to Google Sheet → Filter >10% Changes
  → Build HTML Email → Send to Team → Wait 24h → Clean Up Sheet
```

## Prerequisites

- **n8n** (self-hosted or Cloud)
- **Mixpanel** account with a saved Insights report showing WAU broken down by account
- **Google Sheets** — a blank sheet for logging
- **Gmail** — OAuth2 connected account for sending alerts

## Setup (15 minutes)

### Step 1: Import the Workflow

Open n8n → **Workflows** → **Import from File** → upload `workflow.json`.

### Step 2: Configure Mixpanel

1. **Create an HTTP Basic Auth credential:**
   - Go to n8n **Credentials** → **Add Credential** → **HTTP Basic Auth**
   - **User:** Your Mixpanel Service Account username
   - **Password:** Your Service Account secret
   - Find these in Mixpanel → **Organization Settings** → **Service Accounts**

2. **Update the Fetch WAU Data node:**
   - Replace `YOUR_PROJECT_ID` with your Mixpanel project ID (found in Mixpanel → Project Settings)
   - Replace `YOUR_BOOKMARK_ID` with your saved Insights report ID (from the URL when viewing the report: `mixpanel.com/project/XXXXX/view/XXXXX/app/boards#id=BOOKMARK_ID`)

3. **Update the Process Mixpanel Data code node:**
   - Change `SERIES_KEY` to match your Mixpanel event name (line 3)
   - Default is `'WAU of Session Start'` — replace with whatever your event is called

### Step 3: Set Up Google Sheets

1. Create a new Google Spreadsheet
2. Add these column headers in row 1: `Acc.Id`, `Acc.Subdomain` (the remaining date columns are auto-generated)
3. In n8n, go to **Credentials** → **Add Credential** → **Google Sheets OAuth2**
4. Replace `YOUR_GOOGLE_SHEET_URL` in **both** Google Sheets nodes:
   - **Log to Google Sheet** node
   - **Clean Up Temp Columns** node

### Step 4: Configure Email

Open the **Send Alert Email** node and replace the `sendTo` field with your team's email addresses, comma-separated:

```
cs-lead@yourcompany.com, cs-ops@yourcompany.com
```

Connect your Gmail OAuth2 credential.

### Step 5: Activate

Toggle the workflow to **Active**. It will run every Monday at 11 AM.

## Customization

### Change the Alert Threshold

Open the **Filter Significant Changes** code node and change the `THRESHOLD` variable:

```javascript
const THRESHOLD = 10; // percent — change this
```

- `5` → More alerts (catches smaller usage dips)
- `20` → Fewer alerts (only flags major swings)
- Consider using different thresholds for drops vs. growth by modifying the filter logic

### Change the Schedule

Open the **Every Monday 11 AM** trigger node to adjust:
- `triggerAtDay` → Day of week (0=Sun, 1=Mon, ..., 6=Sat)
- `triggerAtHour` → Hour in your n8n instance timezone

### Track Different Metrics

This workflow uses Mixpanel's Insights API with a saved report (bookmark). You can:
- Create different Mixpanel reports (DAU, feature usage, session count)
- Point the HTTP Request node to a different `bookmark_id`
- Adjust the `SERIES_KEY` in the code node to match the new event name

### Add Slack Alerts

To also post to Slack, add a Slack node after **Build Alert Email** and connect it in parallel with the Gmail node. Use the `$json.html` field (strip HTML tags) or build a separate Slack Block Kit message.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Empty email / no data | Check that your Mixpanel report has data for last week. Verify `project_id` and `bookmark_id` are correct. |
| Auth error on Mixpanel | Service Account credentials may have expired. Regenerate in Mixpanel → Service Accounts. |
| Google Sheets "permission denied" | Re-authorize the Google Sheets OAuth2 credential. Make sure the sheet is owned by or shared with the connected Google account. |
| All accounts filtered out | Lower the `THRESHOLD` in the filter node — your accounts may have <10% changes. |
| Dates look wrong | The date calculation assumes your n8n instance timezone. Check `Settings → Timezone` in your n8n instance. |
