# AI Health Score Calculator

## Overview

This n8n workflow creates a composite customer health score by aggregating signals from multiple data sources. It runs daily, pulling usage data from Mixpanel, support tickets from Zendesk, engagement metrics and NPS/CSAT scores from Salesforce, and stakeholder activity data. The weighted score is written back to your CRM and alerts are sent to Slack when accounts drop below threshold.

## Prerequisites

Before setting up this template, you'll need:

- **n8n instance** (self-hosted or n8n Cloud)
- **Salesforce** — OAuth2 API credentials with read/write access to accounts
- **Zendesk** — API token with ticket search permissions
- **Mixpanel** — Service account or API secret for engagement data
- **Slack workspace** — Bot token with permission to post to channels

## Setup Guide

### Step 1: Import the Workflow

1. Open your n8n instance
2. Go to **Workflows → Import from File**
3. Upload the `workflow.json` file
4. The workflow will appear in your workflow list

### Step 2: Configure Credentials

1. **Salesforce:** Go to n8n Settings → Credentials → Add Salesforce OAuth2 credentials
2. **Zendesk:** Add your Zendesk API credentials (subdomain + API token)
3. **Mixpanel:** Add an HTTP Header Auth credential with your Mixpanel API secret
4. **Slack:** Create a Slack app, add bot token, and configure the Slack credential in n8n

### Step 3: Update API Endpoints

Open each HTTP Request node and replace the placeholder URLs:

- `Fetch Active Accounts` — Your Salesforce account list endpoint
- `Fetch Usage from Mixpanel` — Your Mixpanel engage/export endpoint
- `Fetch Support Tickets` — Your Zendesk search API endpoint
- `Fetch Engagement & NPS` — Your CRM engagement data endpoint
- `Update CRM Health Score` — Your CRM account update endpoint

### Step 4: Customize Health Score Weights

Open the **Calculate Health Score** code node and adjust the weights object:

- `usage` (default: 0.30) — Product usage trends
- `support` (default: 0.20) — Support ticket frequency/severity
- `engagement` (default: 0.20) — Email opens, meeting attendance
- `nps` (default: 0.15) — NPS/CSAT survey scores
- `stakeholder` (default: 0.15) — Champion/exec activity

### Step 5: Configure Alert Threshold

Update the **Score Below Threshold?** node to set your alert threshold (default: 60).

### Step 6: Set Slack Channel

Update the **Send Health Alert to Slack** node with your preferred channel (default: `#cs-health-scores`).

### Step 7: Activate

Toggle the workflow to **Active** and monitor the first run.

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| Schedule | Daily (24h) | How often health scores are recalculated |
| Alert threshold | 60 | Score below this triggers a Slack alert |
| Usage weight | 30% | Weight of product usage in composite score |
| Support weight | 20% | Weight of support ticket signals |
| Engagement weight | 20% | Weight of email/meeting engagement |
| NPS weight | 15% | Weight of NPS/CSAT scores |
| Stakeholder weight | 15% | Weight of stakeholder activity |

## How to Customize

### Add data sources

Add more HTTP Request nodes before the Merge node. Examples:
- **Pendo/Amplitude** — Feature adoption data
- **Gainsight** — Existing health indicators
- **Calendar API** — Meeting frequency with customer

### Customize score thresholds

Edit the status thresholds in the Calculate Health Score node:
- Critical: below 40
- At Risk: 40-59
- Needs Attention: 60-74
- Healthy: 75+

### Add email digest

Add an email node after the filter to send daily health score summaries to CS leadership.

### Historical tracking

Add a node to write scores to a database or spreadsheet for trend analysis over time.

## Troubleshooting

- **No data from Mixpanel** — Verify your API secret and that account IDs match between systems
- **Merge node errors** — Ensure all three data sources return the same `account_id` field
- **Scores all showing 100** — Check that your API endpoints return actual metric data, not empty objects
- **Slack not posting** — Verify bot token permissions and channel name (include the #)
