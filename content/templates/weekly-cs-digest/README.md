# Weekly CS Digest Generator

## Overview

This n8n workflow runs every Monday at 9 AM and compiles a comprehensive weekly digest of customer success activity. It aggregates new risk flags, resolved issues, expansion wins, and upcoming renewals from your CRM, then delivers a formatted summary to CS leadership via Slack and email. No more manual report-building.

## Prerequisites

Before setting up this template, you'll need:

- **n8n instance** (self-hosted or n8n Cloud)
- **Salesforce** — OAuth2 API credentials with read access to accounts, activities, and opportunities
- **Slack workspace** — Bot token with permission to post to channels
- **SMTP credentials** — For sending the email digest

## Setup Guide

### Step 1: Import the Workflow

1. Open your n8n instance
2. Go to **Workflows → Import from File**
3. Upload the `workflow.json` file

### Step 2: Configure Credentials

1. **Salesforce:** Add Salesforce OAuth2 credentials in n8n Settings → Credentials
2. **Slack:** Configure Slack bot credentials
3. **SMTP:** Add your email server credentials

### Step 3: Update API Endpoints

Open each HTTP Request node and replace placeholder URLs:

- `Fetch New Risk Alerts` — Your CRM endpoint for risk alerts created in the last 7 days
- `Fetch Resolved Issues` — Your CRM endpoint for resolved activities
- `Fetch Expansion Wins` — Your CRM closed-won expansion opportunities
- `Fetch Upcoming Renewals` — Your CRM accounts with renewals in the next 30 days

### Step 4: Configure Recipients

- Update Slack channel (default: `#cs-leadership`)
- Update the email to address (default: `cs-leadership@yourcompany.com`)
- Update the from address (default: `cs-digest@yourcompany.com`)

### Step 5: Adjust Schedule

Default: Monday at 9 AM UTC. Edit the **Monday 9 AM Schedule** node's cron expression to adjust timing or timezone.

### Step 6: Activate

Toggle the workflow to **Active**.

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| Schedule | Monday 9 AM UTC | When the digest runs |
| Lookback period | 7 days | How far back to aggregate data |
| Renewal window | 30 days | How far ahead to show renewals |
| Slack channel | #cs-leadership | Where the digest is posted |
| Email recipient | cs-leadership@yourcompany.com | Who gets the email digest |

## How to Customize

### Add more sections

Edit the **Compile Digest** code node to include additional sections:
- **New customers onboarded** — Pull from your onboarding pipeline
- **NPS/CSAT trends** — Include weekly sentiment changes
- **CSM leaderboard** — Top-performing CSMs by accounts saved/expanded

### Change the schedule

Update the cron expression in the trigger node:
- Daily: `0 9 * * *`
- Bi-weekly: `0 9 * * 1,4`
- First Monday of month: `0 9 1-7 * 1`

### Add per-CSM digests

Add a loop that generates individual digests for each CSM, filtered to their accounts only.

### Include charts

Use an HTTP Request to a chart service (QuickChart.io) to generate visual charts for the email version.

### Archive digests

Add a Google Sheets or database node to store each week's metrics for quarterly/annual trend analysis.

## Troubleshooting

- **Empty digest** — Verify your CRM API endpoints return data for the specified date ranges
- **Wrong timezone** — The cron `0 9 * * 1` runs at 9 AM UTC; adjust for your team's timezone
- **Email formatting broken** — Check that the HTML digest doesn't contain unescaped special characters
- **Slack not posting** — Ensure the bot is added to the `#cs-leadership` channel
- **Missing expansion data** — Verify your CRM has a separate opportunity type or stage for expansions
